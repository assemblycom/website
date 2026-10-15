import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { NextRequest } from 'next/server';
import { GET } from '../app/referrals/[slug]/route.ts';
import { attributionFromSearchParams, signupHref } from './powered-by-attribution.ts';

// The product API, as the referral route reads it: one code per branch.
const LONG_FIRM = 'A'.repeat(100);
const API = {
  '/referral/onCode_1': { referrerPortalId: 'portal_1' },
  '/referral/offCode1': {},
  '/referral/longCode': { referrerPortalId: 'portal_2' },
  '/portal/portal_1/config': { fields: { name: 'Acme Co' } },
  '/portal/portal_2/config': { fields: { name: LONG_FIRM } },
};
const realFetch = globalThis.fetch;
beforeEach(() => {
  globalThis.fetch = async (input) => {
    const body = API[new URL(String(input)).pathname];
    return body
      ? new Response(JSON.stringify(body), { status: 200 })
      : new Response('{"code":"not_found"}', { status: 404 });
  };
});
afterEach(() => { globalThis.fetch = realFetch; });

async function visit(path) {
  const url = new URL(path, 'https://assembly.com');
  const slug = decodeURIComponent(url.pathname.split('/').pop());
  const response = await GET(new NextRequest(url), { params: Promise.resolve({ slug }) });
  const location = new URL(response.headers.get('location'));
  // Where the page's CTA then sends them.
  const signup = new URL(signupHref(attributionFromSearchParams(Object.fromEntries(location.searchParams))));
  return { response, location, signup: Object.fromEntries(signup.searchParams) };
}

const UTM = { utm_source: 'assembly', utm_medium: 'referral', utm_campaign: 'referral' };

test('redirects to /powered-by, uncached, never to signup', async () => {
  const { response, location } = await visit('/referrals/Katelyn_onCode_1');
  assert.equal(response.status, 307);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(location.origin, 'https://assembly.com');
  assert.equal(location.pathname, '/powered-by');
});

test('growth-loops on: signup gets ref, firm and first', async () => {
  const { signup } = await visit('/referrals/Katelyn_onCode_1');
  assert.deepEqual(signup, { referrer: 'studio-pricing', ...UTM, utm_content: 'link', ref: 'portal_1', firm: 'Acme Co', first: 'Katelyn' });
});

test('growth-loops off: signup gets referred', async () => {
  const { signup } = await visit('/referrals/Katelyn_offCode1');
  assert.deepEqual(signup, { referrer: 'studio-pricing', ...UTM, utm_content: 'link', referred: 'offCode1' });
});

test('a code the lookup cannot place still reaches signup as referred', async () => {
  // An old link names the user by their `ref`, which only signup can resolve.
  const { signup } = await visit('/referrals/Usman_h6L_2vXvg');
  assert.deepEqual(signup, { referrer: 'studio-pricing', ...UTM, utm_content: 'link', referred: 'h6L_2vXvg' });
});

test('a code that cannot be one: signup gets the UTMs only', async () => {
  const { signup } = await visit('/referrals/Katelyn_not%20a%20code!');
  assert.deepEqual(signup, { referrer: 'studio-pricing', ...UTM, utm_content: 'link' });
});

test('an email invite is tagged email_invite', async () => {
  const { signup } = await visit('/referrals/Katelyn_onCode_1?via=email');
  assert.equal(signup.utm_content, 'email_invite');
  assert.equal(signup.ref, 'portal_1');
});

test('the longest firm name the product allows reaches signup', async () => {
  const { signup } = await visit('/referrals/Katelyn_longCode');
  assert.equal(signup.firm, LONG_FIRM);
});
