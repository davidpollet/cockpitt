/**
 * Parse a string to number. Remove all alphabeticals chars
 */
function parseString(amount: string) {
  return Number(amount.replace(/[^0-9,-]+/g, "").replace(",", "."))
}

export default parseString
