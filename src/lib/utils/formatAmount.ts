export function formatAmount(amount: number) {
  return Intl.NumberFormat("fr-FR", {
    currency: "eur",
    style: "currency",
  }).format(amount)
}

export function formatPercent(number: number) {
  return Intl.NumberFormat(undefined, {
    style: "percent",
    minimumFractionDigits: 2,
  }).format(number / 100)
}

export function formatNumber(
  number: number,
  options: Intl.NumberFormatOptions = { style: "decimal" },
) {
  return Intl.NumberFormat(undefined, options).format(number)
}
