function parseStringAmount(amount: string) {
  return parseFloat(amount.replace(",", ".").replaceAll(/\s/g, ""));
}

export default parseStringAmount
