import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { test } from 'node:test';
import { verifyGhostSignature } from './ghost-webhook.ts';

const SECRET = 'shared-secret';
const BODY = JSON.stringify({ post: { current: { slug: 'fall-2026-updates' } } });
const NOW = 1_800_000_000_000;

// The header exactly as Ghost writes it (webhook-trigger.js in TryGhost/Ghost).
const sign = (body, ts, secret = SECRET) =>
  `sha256=${createHmac('sha256', secret).update(`${body}${ts}`).digest('hex')}, t=${ts}`;

test('accepts a delivery Ghost signed with the shared secret', () => {
  assert.equal(verifyGhostSignature(BODY, sign(BODY, NOW), SECRET, NOW), true);
});

test('refuses a signature made with another secret', () => {
  assert.equal(verifyGhostSignature(BODY, sign(BODY, NOW, 'other'), SECRET, NOW), false);
});

test('refuses a body that was changed after signing', () => {
  assert.equal(verifyGhostSignature(`${BODY} `, sign(BODY, NOW), SECRET, NOW), false);
});

test('refuses a signature older than five minutes', () => {
  const ts = NOW - 6 * 60 * 1000;
  assert.equal(verifyGhostSignature(BODY, sign(BODY, ts), SECRET, NOW), false);
});

test('refuses everything when no secret is configured', () => {
  assert.equal(verifyGhostSignature(BODY, sign(BODY, NOW, ''), undefined, NOW), false);
  assert.equal(verifyGhostSignature(BODY, sign(BODY, NOW), '', NOW), false);
});

test('refuses a missing or malformed header', () => {
  assert.equal(verifyGhostSignature(BODY, null, SECRET, NOW), false);
  assert.equal(verifyGhostSignature(BODY, 'sha256=abc, t=1', SECRET, NOW), false);
});
