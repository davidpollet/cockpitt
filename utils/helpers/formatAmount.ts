function formatAmount(amount: number): string {
  return Intl.NumberFormat("fr-FR", {
    currency: "eur",
    style: "currency",
  }).format(amount)
}

export default formatAmount
