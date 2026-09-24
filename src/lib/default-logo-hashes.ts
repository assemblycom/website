/**
 * SHA-256 of every image the product hands a workspace in place of a logo of
 * its own. A logo whose bytes match one of these is not the firm's, and
 * /powered-by draws the initial instead of it.
 *
 * Matched by content rather than by URL because the URL can't tell them apart:
 * the same Assembly mark turns up under the shared `brand-logos` path and as a
 * copy inside a workspace's own folder, and a path check passes the copy.
 *
 * Where they come from: at portal setup the product looks up branding for the
 * signup email's domain, two ways, so a workspace set up with one of our own
 * addresses carries whatever that lookup returns for our domain without anyone
 * uploading it.
 *
 * - Brand customization (backend/lib/services/brand_customization) copies the
 *   brand API's images, unmodified, into the workspace's own folder as
 *   `<portal>/images/assets/iconUrl/brand-icon.png` and
 *   `.../logoUrl/brand-logo.png`. This is the common case, and the one a path
 *   check can't catch.
 * - The logo finder (backend/lib/services/logofinder) stores logo.dev's result
 *   at the shared `public/images/brand-logos/<domain>-<size>.png`, at 512, 60
 *   and 24px, each at 1x and 2x.
 *
 * Only images that are actually ours belong here, so check what a file shows
 * before adding it, not just its domain. logo.dev answers copilot.com with the
 * Microsoft logo and joinportal.com with Microsoft Copilot's, and those stay
 * off the list: the portal a client just signed into shows them, so this page
 * shows them too rather than contradicting it.
 *
 * The other stand-in, the dummyimage.com letter a workspace gets when the
 * finder comes up empty, needs no entry: it is not on a workspace logo host,
 * so the lookup never fetches it.
 *
 * To add one, hash the file as it is served:
 *   curl -s <url> | shasum -a 256
 */
export const DEFAULT_LOGO_HASHES: ReadonlySet<string> = new Set([
  // Brand customization's copies, byte-identical in every workspace checked
  "2665b6e6609cd2b1a7c2275b4bfba96e368097c4cd3e587a3fdb97a189e59ce5", // brand-icon.png, 300x300
  "667f35bba23f60b954ef7e8043f61785a1c75dab3b1dfec685604605b634dc4c", // brand-logo.png, 900x180 wordmark
  // public/images/brand-logos/assembly-com-*.png
  "351365ee1905debead7a2ef0571b03242590ad7addd7f47a359bb10f7d473d9b", // 512@2x
  "fbdffbad36b35e29ba6aa704f74c46578171404d705bfead7d334f20b0b6c45c", // 512
  "bc3ff5e7901baeca844c3ffa191b5945e874d86aa7b7b2db843a95e971e2166c", // 60@2x
  "3e7b6308b61b3f9ad08fe805d2495676011528d99931e812e4519233a770163a", // 60
  "ca36bc58b6d03b43d5fc6c2bee3d7c1d89ad5a882e2eef22dfce497752a7dc66", // 24@2x
  "d24748420945b7310a7ff60ae89a61bc6ea29ec2b5c123996a656cf6e6c8f2b7", // 24
  // public/images/brand-logos/copilot-app-*.png
  "2f8450d7ad023779ffca1bb79d12597fff5a9410cc4a535526f9063d6e1572b2", // 512@2x
  "c9107cfa7d4ff628227f64efd18b35d09e2dc1816f9a9087fdf55d6871a07c7c", // 512
  "5d4c66a6ad3b664f5e75507c1787cc4e174db5077478dc1ec634a6f588e2efe2", // 60@2x
  "9b7a6f7f06057d20a2cd965267d45a06754c4e801cccfe50615d002d406db302", // 60
  "fb1e9123cf3ef60c69c40527dcde5b4857e6209e813db93cb455766d78f389e6", // 24@2x
  "f4c33142db02fadac83e85f247835c4cbda4940fba747eddf7707ca161e1a2a9", // 24
]);
