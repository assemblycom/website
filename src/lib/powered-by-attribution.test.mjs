import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  attributionFromSearchParams,
  signupHref,
} from './powered-by-attribution.ts';

// What /referrals/[slug] puts on /powered-by, for each kind of code.
const REFERRAL_UTM = {
  utm_source: 'assembly',
  utm_medium: 'referral',
  utm_campaign: 'referral',
  utm_content: 'link',
};

const signupParams = (query) =>
  new URL(signupHref(attributionFromSearchParams(Object.fromEntries(new URLSearchParams(query))))).searchParams;

test('a growth-loops referral reaches signup with ref, firm and first', () => {
  const params = signupParams(new URLSearchParams({ ...REFERRAL_UTM, ref: 'portal_1', firm: 'Acme Co', first: 'Katelyn' }));
  assert.equal(params.get('ref'), 'portal_1');
  assert.equal(params.get('firm'), 'Acme Co');
  assert.equal(params.get('first'), 'Katelyn');
  assert.equal(params.get('utm_medium'), 'referral');
  assert.equal(params.get('referred'), null);
});

test('an old-program referral reaches signup with referred', () => {
  const params = signupParams(new URLSearchParams({ ...REFERRAL_UTM, referred: 'hwe0ZPWvR' }));
  assert.equal(params.get('referred'), 'hwe0ZPWvR');
  assert.equal(params.get('utm_content'), 'link');
  assert.equal(params.get('ref'), null);
});

test('an unknown code reaches signup with the referral UTMs only', () => {
  const params = signupParams(new URLSearchParams(REFERRAL_UTM));
  for (const [key, value] of Object.entries(REFERRAL_UTM)) assert.equal(params.get(key), value);
  for (const key of ['ref', 'firm', 'first', 'referred']) assert.equal(params.get(key), null);
});

test('drops a referred code that cannot be one, and an overlong first name', () => {
  const params = signupParams(new URLSearchParams({ referred: '../admin', first: 'x'.repeat(51) }));
  assert.equal(params.get('referred'), null);
  assert.equal(params.get('first'), null);
});

test('a badge click reaches signup unchanged', () => {
  const badge = { utm_source: 'assembly', utm_medium: 'powered_by', utm_campaign: 'badge', utm_content: 'client_login', ref: 'portal_1', firm: 'Acme Co' };
  const params = signupParams(new URLSearchParams(badge));
  for (const [key, value] of Object.entries(badge)) assert.equal(params.get(key), value);
  assert.deepEqual([...params.keys()].sort(), ['firm', 'ref', 'referrer', ...Object.keys(badge).filter((k) => k.startsWith('utm_'))].sort());
});
