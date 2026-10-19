import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseBenefits, templateCopy } from './template-page.ts';

const text = (value) => ({ nodeType: 'text', value, marks: [], data: {} });
const block = (nodeType, value) => ({ nodeType, data: {}, content: [text(value)] });
const h2 = (v) => block('heading-2', v);
const h3 = (v) => block('heading-3', v);
const p = (v) => block('paragraph', v);
const doc = (...content) => ({ nodeType: 'document', data: {}, content });

const cards = (n) =>
  Array.from({ length: n }, (_, i) => [h3(`Card ${i + 1}`), p(`Body ${i + 1}`)]).flat();

test('reads the heading and cards in the agreed layout', () => {
  const result = parseBenefits(
    doc(p('Old intro, ignored'), h2('Project updates'), ...cards(4), block('heading-3', 'Perfect for'), p('')),
  );
  // The trailing "Perfect for" H3 has no paragraph after it once empties drop,
  // so a fifth card can't form and the layout is rejected rather than truncated.
  assert.equal(result, null);

  const ok = parseBenefits(doc(p('Old intro'), h2('Project updates'), ...cards(4), p('')));
  assert.deepEqual(ok, {
    heading: 'Project updates',
    cards: [1, 2, 3, 4].map((i) => ({ title: `Card ${i}`, body: `Body ${i}` })),
  });
});

test('stops at the first non-card node, so old copy after the cards is ignored', () => {
  const result = parseBenefits(doc(h2('Benefits'), ...cards(2), block('unordered-list', 'x'), p('Perfect for…')));
  assert.equal(result?.cards.length, 2);
});

test('drops marks: an italic run reads as plain text', () => {
  const italic = { nodeType: 'paragraph', data: {}, content: [text('Plain '), { ...text('slanted'), marks: [{ type: 'italic' }] }] };
  const result = parseBenefits(doc(h2('Benefits'), h3('One'), italic, ...cards(1)));
  assert.equal(result?.cards[0].body, 'Plain slanted');
});

test('rejects the old layout, too few cards, and too many', () => {
  const old = doc(p('Keep clients in the loop'), h3('Key Features'), block('unordered-list', 'x'), h3('Perfect for'), p('Marketing firms'));
  assert.equal(parseBenefits(old), null);
  assert.equal(parseBenefits(doc(h2('Benefits'), ...cards(1))), null);
  assert.equal(parseBenefits(doc(h2('Benefits'), ...cards(5))), null);
  assert.equal(parseBenefits(undefined), null);
});

test('the definition names the template; the FAQ heading uses the keyword', () => {
  const copy = templateCopy({
    name: 'Client project tracker',
    seoKeyword: 'project tracker template',
    seoTitle: 'Free Project Tracker Template for Clients',
    definitionBody: 'A shared view.',
  });
  assert.equal(copy.definition?.heading, 'What is a client project tracker?');
  assert.equal(copy.faqHeading, 'Questions about this project tracker template');
  assert.equal(copy.seoTitle, 'Free Project Tracker Template for Clients');
  assert.equal(templateCopy({ name: 'Onboarding wizard', definitionBody: 'z' }).definition?.heading, 'What is an onboarding wizard?');
});

test('falls back field by field, never to the gallery subtitle', () => {
  const copy = templateCopy({ name: 'Time tracker', longDescription: 'Track billable time per client.' });
  assert.equal(copy.headline, 'Time tracker');
  assert.equal(copy.lead, undefined);
  assert.equal(copy.definition, null);
  assert.equal(copy.faqHeading, 'Questions about this time tracker');
  assert.equal(copy.ctaHeading, 'Start with the Time tracker template');
  assert.equal(copy.seoTitle, 'Time Tracker Template');
  assert.equal(copy.seoDescription, 'Track billable time per client.');
  assert.equal(templateCopy({ name: 'x', heroDescription: 'Hero.', longDescription: 'Long.' }).seoDescription, 'Hero.');
  assert.equal(templateCopy({ name: 'x' }).seoDescription, undefined);
});
