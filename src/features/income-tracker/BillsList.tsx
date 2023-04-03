import { AnimatePresence } from "framer-motion"
import { Bill } from "./Bill"
import { BillsListItem } from "./BillsListItem"
import { OpenNewBill } from "./IncomesTracker"
import Spinner from "src/ui/Spinner"
import { useBills } from "./useBills"

export function BillsList() {
  const { bills: billsRaw, isLoading, addDummyBills } = useBills()
  const billsNotSent = billsRaw
    .filter((bill: Bill) => !bill.sentAt)
    .sort((a: Bill, b: Bill) => (b.createdAt || 0) - (a.createdAt || 0))

  const billsSent = billsRaw
    .filter((bill: Bill) => bill.sentAt && !bill.cashedAt)
    .sort((a: Bill, b: Bill) => (a.sentAt || 0) - (b.sentAt || 0))

  const billsCashed = billsRaw
    .filter((bill: Bill) => bill.cashedAt)
    .sort((a: Bill, b: Bill) => (b.cashedAt || 0) - (a.cashedAt || 0))

  const bills = billsNotSent.concat(billsSent, billsCashed)

  if (isLoading)
    return (
      <div className="flex justify-center p-2">
        <Spinner />
      </div>
    )

  if (bills.length === 0)
    return (
      <div
        role="row"
        className="grid gap-2 p-2 text-center dark:bg-violet-850 lg:p-4"
      >
        <p className="text-xl font-bold text-violet-500 dark:text-white lg:text-2xl">
          Aucune facture à afficher
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="button is-outline justify-self-center dark:from-violet-300 dark:to-violet-300 dark:text-violet-100 dark:ring-violet-100 dark:hover:text-violet-600"
            onClick={addDummyBills}
          >
            Tester la démo
          </button>
          <OpenNewBill />
        </div>
      </div>
    )

  return (
    <ol
      role="rowgroup"
      className={`grid gap-[1px] overflow-hidden rounded-md transition-all duration-300 ease-in-out`}
    >
      <AnimatePresence>
        {bills.map((bill: Bill) => (
          <BillsListItem key={bill.id} bill={bill} />
        ))}
      </AnimatePresence>
    </ol>
  )
}
