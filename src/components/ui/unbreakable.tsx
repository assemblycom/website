// A short hyphenated word is one word: balancing broke "AI-powered" across two
// lines at the hyphen, which reads as a typo in a headline. Long compounds still
// break — holding one whole would push it past the measure.
//
// Shared by the post titles and the comparison section headings, which hit the
// same thing on "all-inclusive" and "white-labeled".
const UNBREAKABLE_MAX = 14;

export function unbreakable(text: string) {
  return text.split(/(\s+)/).map((part, i) =>
    part.includes("-") && part.length <= UNBREAKABLE_MAX ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
