import assert from 'node:assert/strict';
import { test } from 'node:test';
import { legacyFeature, parseBenefits, parseLegacyOverview, templateCopy } from './template-page.ts';

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

test('the definition and the FAQ heading both use the keyword', () => {
  const copy = templateCopy({
    name: 'Client project tracker',
    seoKeyword: 'project tracker template',
    seoTitle: 'Free Project Tracker Template for Clients',
    definitionBody: 'A shared view.',
  });
  assert.equal(copy.definition?.heading, 'What is a project tracker template?');
  assert.equal(
    templateCopy({ name: 'Booking app', seoKeyword: 'online booking system', definitionBody: 'z' }).definition?.heading,
    'What is an online booking system?',
  );
  assert.equal(copy.faqHeading, 'Questions about this project tracker template');
  assert.equal(copy.seoTitle, 'Free Project Tracker Template for Clients');
  assert.equal(templateCopy({ name: 'Onboarding wizard', definitionBody: 'z' }).definition?.heading, 'What is an onboarding wizard?');
});

test('the definition article follows the sound, and acronyms keep their capitals', () => {
  const heading = (name) => templateCopy({ name, definitionBody: 'z' }).definition?.heading;
  assert.equal(heading('Online booking form'), 'What is an online booking form?');
  assert.equal(heading('AI receptionist'), 'What is an AI receptionist?');
  assert.equal(heading('Internal AI assistant'), 'What is an internal AI assistant?');
  assert.equal(heading('PDF to digital intake'), 'What is a PDF to digital intake?');
  assert.equal(heading('RSVP tracker'), 'What is an RSVP tracker?');
  assert.equal(heading('RSVP-based registration form'), 'What is an RSVP-based registration form?');
  assert.equal(heading('SaaS-style pricing page'), 'What is a SaaS-style pricing page?');
  assert.equal(heading('Unified inbox'), 'What is a unified inbox?');
  assert.equal(heading('Uninsured patient intake form'), 'What is an uninsured patient intake form?');
  assert.equal(heading('Unidentified payments log'), 'What is an unidentified payments log?');
  assert.equal(heading('SaaS onboarding template'), 'What is a SaaS onboarding template?');
  assert.equal(heading('SAAS onboarding template'), 'What is a SAAS onboarding template?');
  assert.equal(heading('One-page proposal'), 'What is a one-page proposal?');
  assert.equal(heading('Hourly timesheet'), 'What is an hourly timesheet?');
  assert.equal(heading('Meeting Request'), 'What is a meeting request?');
});

test('falls back field by field, never to the gallery subtitle', () => {
  const copy = templateCopy({ name: 'Time tracker', longDescription: 'Track billable time per client.' });
  assert.equal(copy.headline, 'Time tracker');
  assert.equal(copy.lead, undefined);
  assert.equal(copy.definition, null);
  assert.equal(copy.faqHeading, 'Questions about this time tracker');
  assert.equal(copy.ctaHeading, 'Start with the time tracker template');
  assert.equal(templateCopy({ name: 'Xero integration' }).ctaHeading, 'Start with the Xero integration template');
  assert.equal(templateCopy({ name: 'Google Slides' }).ctaHeading, 'Start with the Google Slides template');
  assert.equal(templateCopy({ name: 'QuickBooks integration' }).ctaHeading, 'Start with the QuickBooks integration template');
  assert.equal(copy.seoTitle, 'Time Tracker Template');
  assert.equal(copy.seoDescription, 'Track billable time per client.');
  assert.equal(templateCopy({ name: 'x', heroDescription: 'Hero.', longDescription: 'Long.' }).seoDescription, 'Hero.');
  assert.equal(templateCopy({ name: 'x' }).seoDescription, undefined);
});

test('an older overview keeps its first sentence and its feature list', () => {
  const p = (value) => ({ nodeType: 'paragraph', data: {}, content: [{ nodeType: 'text', value, marks: [], data: {} }] });
  const h = (value) => ({ nodeType: 'heading-3', data: {}, content: [{ nodeType: 'text', value, marks: [], data: {} }] });
  const li = (value) => ({ nodeType: 'list-item', data: {}, content: [p(value)] });
  const doc = {
    nodeType: 'document',
    data: {},
    content: [
      p('The Xero Integration is a one-way sync to Xero. When you create an invoice, it is created in Xero.'),
      p('Start from this template and describe what you want to change.'),
      h('Key Features'),
      { nodeType: 'unordered-list', data: {}, content: [li('Sync invoices.'), li('Match customers.')] },
      h('Perfect for'),
      p('Every firm.'),
    ],
  };
  assert.deepEqual(parseLegacyOverview(doc), {
    intro: 'The Xero Integration is a one-way sync to Xero.',
    features: ['Sync invoices.', 'Match customers.'],
  });
});

test('an older feature item gets a title from the table, its own label, or none', () => {
  assert.deepEqual(legacyFeature('xero', 'Automatically sync Assembly invoices and customers to Xero.'), {
    label: 'Automatic sync',
    body: 'Automatically sync Assembly invoices and customers to Xero.',
  });
  assert.deepEqual(legacyFeature('billing-app', 'Services - list services you sell to be used across all payments surface areas.'), {
    label: 'Services',
    body: 'List services you sell to be used across all payments surface areas.',
  });
  assert.deepEqual(legacyFeature('client-engagement-dashboard', 'Detail view: activity chart, app usage breakdown'), {
    label: 'Detail view',
    body: 'Activity chart, app usage breakdown',
  });
  assert.deepEqual(legacyFeature('unknown', 'Clients comment and pick a direction'), { label: 'Clients comment and pick a direction' });
});
