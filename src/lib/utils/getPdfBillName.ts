import { Bill } from "src/features/income-tracker/Bill"

export function getPdfBillName(bill: Bill) {
  const date = {
    day: new Date(bill.createdAt).getDate().toString().padStart(2, "0"),
    month: (1 + new Date(bill.createdAt).getMonth())
      .toString()
      .padStart(2, "0"),
    year: new Date(bill.createdAt).getFullYear(),
  }
  const customerName = bill.customer.name
  const billNumber = bill.number.toString().padStart(2, "0")
  return `${date.year}-${date.month}-${date.day}__F${billNumber}__${customerName}`
}
