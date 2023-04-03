import { Bill } from "./Bill"

export function calcBillSum(bill: Bill) {
  return bill.services?.reduce(
    (sum, currentService) =>
      sum + currentService.quantity * currentService.price,
    0,
  )
}
