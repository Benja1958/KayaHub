/*
 * Display-only tidying for landlord-entered text. Never use these to
 * change stored data.
 */

/* Trims, collapses repeated whitespace and puts one space after each comma. */
export function tidyDisplayText(
  value: string | null | undefined
): string {
  return (value ?? "")
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .trim();
}

/*
 * Capitalizes a word's first letter only when the rest of it is all
 * lowercase: "thika" → "Thika", while "KICC" or "eastLeigh" are left as typed.
 */
function capitalizeIfLowercase(
  word: string
): string {
  const rest = word.slice(1);

  if (rest !== rest.toLowerCase()) {
    return word;
  }

  return (
    word.charAt(0).toUpperCase() + rest
  );
}

/* "Jomoko,thika" → "Jomoko, Thika"; "KICC Area" stays as is. */
export function formatLocationForDisplay(
  location: string | null | undefined
): string {
  return tidyDisplayText(location)
    .split(" ")
    .map(capitalizeIfLowercase)
    .join(" ");
}

export function formatTitleForDisplay(
  title: string | null | undefined
): string {
  return tidyDisplayText(title);
}
