import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MOBILE_NAV_SECTIONS, NAV_ENTRIES, isNavGroup } from './constants.ts';

// The phone menu files links into its own sections by href, so a link added to
// or renamed in the desktop nav would otherwise drop off phones without a trace.
test('the phone menu carries every desktop nav link exactly once', () => {
  const desktop = NAV_ENTRIES.flatMap((entry) =>
    isNavGroup(entry) ? entry.items : [entry],
  ).map((link) => link.href);
  const mobile = MOBILE_NAV_SECTIONS.flatMap((section) => section.items).map(
    (link) => link.href,
  );

  assert.deepEqual(
    mobile.filter((href, i) => mobile.indexOf(href) !== i),
    [],
    'links repeated in the phone menu',
  );
  assert.deepEqual(
    desktop.filter((href) => !mobile.includes(href)),
    [],
    'desktop links missing from the phone menu',
  );
});
