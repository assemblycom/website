import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { JSDOM } from 'jsdom';
import { buildSignupUrl } from './constants.ts';

let dom;
const attribution = await import('./signup-attribution.ts');
afterEach(() => { delete globalThis.window; delete globalThis.document; });
const browser = (url) => {
  dom = new JSDOM('', { url });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  dom.window.document.body.innerHTML = '';
};

test('forwards only acquisition fields and preserves signup inputs', () => {
  browser('https://assembly.com/?msclkid=landing-click&utm_source=bing&email=untrusted&referrer=wrong&prompt=wrong');
  const result = new URL(attribution.withSignupAttribution(buildSignupUrl('Build invoices', { id: 'app-1', name: 'Invoices', description: 'Invoice clients' }, 'visitor@example.test')));
  assert.equal(result.searchParams.get('msclkid'), 'landing-click');
  assert.equal(result.searchParams.get('utm_source'), 'bing');
  assert.equal(result.searchParams.get('referrer'), 'studio-pricing');
  assert.equal(result.searchParams.get('prompt'), 'Build invoices');
  assert.equal(result.searchParams.get('templateId'), 'app-1');
  assert.equal(result.searchParams.get('email'), 'visitor@example.test');
});

test('keeps acquisition after an internal navigation removes the query', () => {
  browser('https://assembly.com/?msclkid=landing-click&utm_campaign=contracts');
  attribution.readSignupAttribution();
  dom.reconfigure({ url: 'https://assembly.com/pricing' });
  const result = new URL(attribution.withSignupAttribution(buildSignupUrl()));
  assert.equal(result.searchParams.get('msclkid'), 'landing-click');
  assert.equal(result.searchParams.get('utm_campaign'), 'contracts');
});

test('a new acquisition replaces the previous campaign rather than mixing identities', () => {
  browser('https://assembly.com/?msclkid=old-click&utm_source=bing');
  attribution.readSignupAttribution();
  dom.reconfigure({ url: 'https://assembly.com/?gclid=new-click&utm_source=google' });
  const result = new URL(attribution.withSignupAttribution(buildSignupUrl()));
  assert.equal(result.searchParams.get('gclid'), 'new-click');
  assert.equal(result.searchParams.get('utm_source'), 'google');
  assert.equal(result.searchParams.has('msclkid'), false);
});

test('preserves explicit referral attribution and the hero experiment arm', () => {
  browser('https://assembly.com/?utm_source=bing&msclkid=landing-click');
  const result = new URL(attribution.withSignupAttribution(buildSignupUrl() + '&utm_source=assembly&heroArm=control-big'));
  assert.equal(result.searchParams.get('utm_source'), 'assembly');
  assert.equal(result.searchParams.get('heroArm'), 'control-big');
  assert.equal(result.searchParams.get('msclkid'), 'landing-click');
});

test('does not decorate other destinations or similar-looking signup paths', () => {
  browser('https://assembly.com/?msclkid=landing-click');
  for (const url of ['https://example.test/signup', 'https://dashboard.assembly.com/signup-evil', 'https://dashboard.assembly.com/login']) {
    assert.equal(attribution.withSignupAttribution(url), url);
  }
});

test('works without browser APIs and without writable session storage', () => {
  assert.equal(attribution.withSignupAttribution(buildSignupUrl()), buildSignupUrl());
  browser('https://assembly.com/?msclkid=landing-click');
  Object.defineProperty(dom.window, 'sessionStorage', { configurable: true, get() { throw new Error('blocked'); } });
  assert.equal(new URL(attribution.withSignupAttribution(buildSignupUrl())).searchParams.get('msclkid'), 'landing-click');
  delete dom.window.sessionStorage;
});

test('blocked storage retains the campaign across navigation and replaces it on a new landing', () => {
  browser('https://assembly.com/?msclkid=landing-click&utm_source=bing');
  Object.defineProperty(dom.window, 'sessionStorage', { get() { throw new Error('blocked'); } });
  attribution.readSignupAttribution();
  dom.reconfigure({ url: 'https://assembly.com/pricing' });
  let result = new URL(attribution.withSignupAttribution(buildSignupUrl()));
  assert.equal(result.searchParams.get('msclkid'), 'landing-click');
  assert.equal(result.searchParams.get('utm_source'), 'bing');
  dom.reconfigure({ url: 'https://assembly.com/?gclid=new-click&utm_source=google' });
  attribution.readSignupAttribution();
  dom.reconfigure({ url: 'https://assembly.com/templates' });
  result = new URL(attribution.withSignupAttribution(buildSignupUrl()));
  assert.equal(result.searchParams.get('gclid'), 'new-click');
  assert.equal(result.searchParams.has('msclkid'), false);
  assert.equal(result.searchParams.get('utm_source'), 'google');
});

test('oversized campaign fields fit without a prompt while preserving click IDs and signup inputs', () => {
  browser('https://assembly.com/?msclkid=landing-click&utm_source=bing&utm_campaign=' + '🧾'.repeat(1000) + '&utm_content=' + 'x'.repeat(3000));
  const href = attribution.withSignupAttribution(buildSignupUrl(undefined, { id: 'app-1', name: 'Invoices', description: 'Invoice clients' }, 'visitor@example.test') + '&heroArm=control-big');
  assert.ok(href.length <= 2048);
  const result = new URL(href);
  assert.equal(result.searchParams.get('msclkid'), 'landing-click');
  assert.equal(result.searchParams.get('utm_source'), 'bing');
  assert.equal(result.searchParams.get('templateId'), 'app-1');
  assert.equal(result.searchParams.get('email'), 'visitor@example.test');
  assert.equal(result.searchParams.get('heroArm'), 'control-big');
});

test('decorates mounted and dynamically added links and survives href replacement', async () => {
  browser('https://assembly.com/?msclkid=landing-click');
  const stop = attribution.observeSignupLinks(document);
  const link = document.createElement('a');
  link.href = buildSignupUrl();
  document.body.append(link);
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(new URL(link.href).searchParams.get('msclkid'), 'landing-click');
  link.href = buildSignupUrl('New prompt');
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(new URL(link.href).searchParams.get('msclkid'), 'landing-click');
  assert.equal(new URL(link.href).searchParams.get('prompt'), 'New prompt');
  stop();
});


test('keeps the URL within the prompt budget when attribution is appended', () => {
  browser('https://assembly.com/?msclkid=landing-click&utm_campaign=contracts');
  const href = attribution.withSignupAttribution(buildSignupUrl('🧾'.repeat(1000)));
  assert.ok(href.length <= 2048);
  assert.equal(new URL(href).searchParams.get('msclkid'), 'landing-click');
});

test('updates decorated links when a new campaign arrives', () => {
  browser('https://assembly.com/?msclkid=old-click&utm_source=bing');
  const link = document.createElement('a');
  link.href = buildSignupUrl();
  document.body.append(link);
  attribution.observeSignupLinks(document)();
  dom.reconfigure({ url: 'https://assembly.com/?msclkid=new-click&utm_source=bing' });
  attribution.observeSignupLinks(document)();
  assert.equal(new URL(link.href).searchParams.get('msclkid'), 'new-click');
});


test('new campaigns replace our attribution after another decorator adds the hero arm', () => {
  browser('https://assembly.com/?msclkid=old-click&utm_source=bing');
  const link = document.createElement('a');
  link.href = buildSignupUrl();
  document.body.append(link);
  attribution.observeSignupLinks(document)();
  link.href += '&heroArm=control-big';
  attribution.observeSignupLinks(document)();
  dom.reconfigure({ url: 'https://assembly.com/?msclkid=new-click&utm_source=bing' });
  attribution.observeSignupLinks(document)();
  assert.equal(new URL(link.href).searchParams.get('msclkid'), 'new-click');
  assert.equal(new URL(link.href).searchParams.get('heroArm'), 'control-big');
});
