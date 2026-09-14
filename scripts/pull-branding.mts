/**
 * Pulls a real workspace's branding out of the product and prints it as a
 * BuiltOnFirm literal, so /built-on can be checked against branding firms
 * actually chose rather than the six invented ones.
 *
 *   npx tsx scripts/pull-branding.mts --list 20        # real workspaces to pick from
 *   npx tsx scripts/pull-branding.mts <portal-id|email> [more...] [--env production]
 *
 * Needs an AWS session first: `aws sso login --profile portal1`.
 *
 * Read-only. Everything it prints already exists on the workspace; the whole
 * point of the exercise is that the real lookup has nothing to compute.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const ENVS = {
  production: {
    table: "coredb-production",
    region: "us-west-2",
    pools: ["us-west-2_MUtdEJDOf", "us-west-2_7havpKKnM"],
  },
  staging: {
    table: "coredb-dev",
    region: "us-east-1",
    pools: ["us-east-1_68WePm9cv", "us-east-1_ErH71HWE7"],
  },
} as const;

const PROFILE = process.env.AWS_PROFILE ?? "portal1";

type Env = keyof typeof ENVS;

/** One `aws` call, with the profile and region this env needs. */
async function aws(env: Env, args: string[]) {
  const { stdout } = await run("aws", args, {
    env: {
      ...process.env,
      AWS_PROFILE: PROFILE,
      AWS_REGION: ENVS[env].region,
      AWS_PAGER: "",
    },
    maxBuffer: 32 * 1024 * 1024,
  });
  return stdout ? JSON.parse(stdout) : undefined;
}

/** A DynamoDB item, by its exact key. */
async function getItem(env: Env, pkey: string, skey: string) {
  const res = await aws(env, [
    "dynamodb",
    "query",
    "--table-name",
    ENVS[env].table,
    "--key-condition-expression",
    "pkey = :pk AND skey = :sk",
    "--expression-attribute-values",
    JSON.stringify({ ":pk": { S: pkey }, ":sk": { S: skey } }),
  ]);
  return res?.Items?.[0];
}

/**
 * The portal behind an email, by way of Cognito. Internal pool first: the
 * person who picked the branding is on the firm's own team, not a client.
 */
async function portalIdForEmail(env: Env, email: string) {
  for (const pool of ENVS[env].pools) {
    const res = await aws(env, [
      "cognito-idp",
      "list-users",
      "--user-pool-id",
      pool,
      "--filter",
      `email = "${email}"`,
      "--limit",
      "10",
    ]);
    for (const user of res?.Users ?? []) {
      for (const skey of ["USER", "CLIENT_USER"]) {
        const record = await getItem(env, user.Username, skey);
        const portalId = record?.portalId?.S;
        if (portalId) return portalId;
      }
    }
  }
  return undefined;
}

/**
 * DynamoDB's attribute-value wrapping, unwrapped. Portal records nest the
 * interesting parts several maps deep, and every leaf arrives as {S: "..."}.
 *
 * `any` is the honest type: the shape is whatever the record holds, and every
 * caller reads it by optional chaining rather than by a contract.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
function plain(value: unknown): any {
  const node = value as Record<string, any>;
  if (value == null || typeof value !== "object") return value;
  if ("S" in node) return node.S;
  if ("BOOL" in node) return node.BOOL;
  if ("N" in node) return Number(node.N);
  if ("NULL" in node) return undefined;
  if ("L" in node) return node.L.map(plain);
  if ("M" in node) return plain(node.M);
  return Object.fromEntries(
    Object.entries(node).map(([k, v]) => [k, plain(v)]),
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Whether a logo is the firm's own upload or Assembly's stand-in.
 *
 * Nearly every workspace has a logoImageUrl, because an unbranded one carries
 * a shared Assembly mark from public/images/brand-logos. Only an upload is
 * filed under the workspace's own id, so the path is what tells them apart —
 * and /built-on must show the initial rather than Assembly's own logo when a
 * firm never uploaded one.
 */
function isOwnLogo(logoUrl: string | undefined, portalId: string) {
  return Boolean(logoUrl && logoUrl.includes(`/${portalId}/`));
}

/** Whether the marketing site could actually render this logo. */
async function isPubliclyReadable(url: string) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return res.ok;
  } catch {
    return false;
  }
}

interface Pulled {
  input: string;
  error?: string;
  portalId?: string;
  standInLogo?: boolean;
  firm?: Record<string, unknown>;
  disableBadge?: boolean;
  logoReadable?: boolean;
}

async function pull(env: Env, input: string): Promise<Pulled> {
  const portalId = input.includes("@")
    ? await portalIdForEmail(env, input)
    : input;
  if (!portalId) return { input, error: "no workspace found for that email" };

  const [configItem, onboardingItem] = await Promise.all([
    getItem(env, portalId, "PORTAL_CONFIG"),
    getItem(env, portalId, "PORTAL_ONBOARDING"),
  ]);
  if (!configItem) return { input, error: `no PORTAL_CONFIG for ${portalId}` };

  const config = plain(configItem);
  const fields = config.fields ?? config;
  const onboarding = onboardingItem ? plain(onboardingItem) : {};

  const rawLogoUrl = fields.assets?.logo?.logoImageUrl || undefined;
  const ownLogo = isOwnLogo(rawLogoUrl, portalId);
  const logoUrl = ownLogo ? rawLogoUrl : undefined;

  return {
    input,
    portalId,
    standInLogo: Boolean(rawLogoUrl) && !ownLogo,
    firm: {
      id: fields.subdomain || portalId,
      name: fields.name || fields.portalHeader || portalId,
      logoUrl,
      brandColor: fields.brand?.clientSidebarBackgroundColor || undefined,
      sidebarTextColor: fields.brand?.clientSidebarTextColor || undefined,
      industry: onboarding.fields?.industry ?? onboarding.industry,
    },
    // Not the /built-on opt-out — this is the existing client-marketing-site
    // badge flag. Reported because it is the closest thing that already exists.
    disableBadge: fields.MarketingSite?.disableBadge ?? false,
    logoReadable: logoUrl ? await isPubliclyReadable(logoUrl) : undefined,
  };
}

/**
 * Real workspaces worth testing against, newest pages of the entity-type index
 * first. Only the ones that actually branded themselves: a workspace with no
 * logo and no colour exercises the same fallback the invented ones already do,
 * so it teaches nothing this page has not been checked against.
 */
async function list(env: Env, want: number) {
  const found: Array<Record<string, string>> = [];
  let startKey: unknown;

  for (let page = 0; page < 20 && found.length < want; page++) {
    const res = await aws(env, [
      "dynamodb",
      "query",
      "--table-name",
      ENVS[env].table,
      "--index-name",
      "sortKeyIndex",
      "--key-condition-expression",
      "skey = :sk",
      "--expression-attribute-values",
      JSON.stringify({ ":sk": { S: "PORTAL_CONFIG" } }),
      "--limit",
      "200",
      ...(startKey
        ? ["--exclusive-start-key", JSON.stringify(startKey)]
        : []),
    ]);

    for (const item of res?.Items ?? []) {
      const record = plain(item);
      const fields = record.fields ?? record;
      const portalId = record.pkey ?? record.portalId ?? "";
      const brandColor = fields.brand?.clientSidebarBackgroundColor;
      const logoUrl = fields.assets?.logo?.logoImageUrl;
      const ownLogo = isOwnLogo(logoUrl, portalId);
      if (!brandColor && !ownLogo) continue;
      found.push({
        portalId,
        subdomain: fields.subdomain ?? "",
        name: fields.name ?? fields.portalHeader ?? "",
        brandColor: brandColor ?? "—",
        logo: ownLogo ? "own" : "stand-in",
      });
      if (found.length >= want) break;
    }

    startKey = res?.LastEvaluatedKey;
    if (!startKey) break;
  }
  return found;
}

/** The literal, shaped exactly like the entries in built-on-firms.ts. */
function toLiteral(firm: Record<string, unknown>) {
  const lines = Object.entries(firm)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `    ${k}: ${JSON.stringify(v)},`);
  return `  {\n${lines.join("\n")}\n  },`;
}

const args = process.argv.slice(2);
const envFlag = args.indexOf("--env");
const env: Env = envFlag === -1 ? "production" : (args[envFlag + 1] as Env);
// The index after a flag is that flag's value, not an input. Guard the -1 an
// absent flag returns, which would otherwise claim index 0.
const listIndex = args.indexOf("--list");
const skip = new Set(
  [envFlag, listIndex].filter((i) => i !== -1).map((i) => i + 1),
);
const inputs = args.filter((a, i) => !a.startsWith("--") && !skip.has(i));

const listFlag = args.indexOf("--list");
if (listFlag !== -1) {
  const want = Number(args[listFlag + 1]) || 20;
  const rows = await list(env, want).catch((err) => {
    const message = String(err?.stderr || err?.message || err);
    if (message.includes("SSO session")) {
      console.error(`\nNo AWS session. Run:  aws sso login --profile ${PROFILE}`);
      process.exit(1);
    }
    throw err;
  });
  console.table(rows);
  console.log(
    `\n${rows.length} branded workspaces on ${env}. Pull one with:\n  npm run pull-branding -- <portalId>`,
  );
  process.exit(0);
}

if (!inputs.length || !ENVS[env]) {
  console.error(
    "usage: npx tsx scripts/pull-branding.mts <portal-id|email> [...] [--env production|staging]",
  );
  process.exit(1);
}

const results: Pulled[] = await Promise.all(
  inputs.map((i): Promise<Pulled> =>
    pull(env, i).catch((err) => {
      const message = String(err?.stderr || err?.message || err);
      if (message.includes("SSO session")) {
        console.error(`\nNo AWS session. Run:  aws sso login --profile ${PROFILE}`);
        process.exit(1);
      }
      const detail = message.trim().split("\n").pop() ?? message;
      return { input: i, error: detail } satisfies Pulled;
    }),
  ),
);

for (const r of results) {
  if (r.error || !r.firm) {
    console.error(`\n// ${r.input}: ${r.error}`);
    continue;
  }
  const notes = [
    `workspace ${r.portalId}`,
    r.logoReadable === false && "LOGO NOT PUBLICLY READABLE",
    r.standInLogo && "logo dropped: Assembly stand-in, not their upload",
    r.disableBadge && "marketing-site badge already disabled",
    !r.firm.brandColor && "no brand colour",
    !r.firm.industry && "no onboarding industry",
  ].filter(Boolean);
  console.log(`\n  // ${notes.join(" · ")}`);
  console.log(toLiteral(r.firm));
}
