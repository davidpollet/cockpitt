import { Bill } from "./Bill"
import { getRelativeDateLabel } from "src/lib/utils/getRelativeTime"

export function getStatusLabel(bill: Bill) {
  const isCashed = Boolean(bill.cashedAt)
  const isSentButNotReminded = Boolean(bill.sentAt && !bill.remindedAt.at(0))
  const isReminded = Boolean(bill.remindedAt.at(0))

  if (isCashed) {
    return getRelativeDateLabel("Encaissée", bill.cashedAt as number)
  } else if (isSentButNotReminded) {
    return getRelativeDateLabel("Envoyée", bill.sentAt as number)
  } else if (isReminded) {
    return getRelativeDateLabel("Relancée", bill.remindedAt.at(0) as number)
  } else {
    return getRelativeDateLabel("Créée", bill.createdAt)
  }
}
