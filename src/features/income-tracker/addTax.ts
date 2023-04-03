export const taxRates = [0, 5.5, 20] as const
export type TaxRates = typeof taxRates
export type TaxRate = typeof taxRates[number]

export const addTax = (amount: number, tva: TaxRate) =>
  amount + amount * (tva / 100)
