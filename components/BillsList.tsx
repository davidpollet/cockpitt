import { addDummyBills, removeDummyBills } from "@store/features/incomeSlice"
import { useDispatch, useSelector } from "react-redux"

import { AnimatePresence } from "framer-motion"
import BillsListItem from "./BillsListItem"
import { RootState } from "@store/store"
import { billProps } from "@localTypes/billProps"
import classNames from "classnames"

const BillsListTwClass = classNames([
  "grid gap-[1px] bg-gray-100/80 p-1 pb-2 transition-all duration-300 ease-in-out",
  "dark:bg-violet-750 dark:p-0",
  " lg:px-2 lg:pt-2",
])

const testDemoButtonTwClass = classNames([
  "button is-outline justify-self-center",
  "dark:ring-violet-100 dark:from-violet-300 dark:to-violet-300 dark:text-violet-100 dark:hover:text-violet-600",
])

function BillsList() {
  const dispatch = useDispatch()
  const getBills = useSelector(
    (store: RootState): billProps[] => store.income.bills
  )
  const billsNotSent = getBills
    .filter((bill: billProps) => !bill.sentAt)
    .sort(
      (a: billProps, b: billProps) => (b.createdAt || 0) - (a.createdAt || 0)
    )

  const billsSent = getBills
    .filter((bill: billProps) => bill.sentAt && !bill.cashedAt)
    .sort((a: billProps, b: billProps) => (a.sentAt || 0) - (b.sentAt || 0))

  const billsCashed = getBills
    .filter((bill: billProps) => bill.cashedAt)
    .sort((a: billProps, b: billProps) => (b.cashedAt || 0) - (a.cashedAt || 0))

  const bills = billsNotSent.concat(billsSent, billsCashed)

  function initializeDemo() {
    dispatch(addDummyBills())
  }

  if (bills.length === 0)
    return (
      <div
        role="row"
        className="grid gap-2 p-2 text-center dark:bg-violet-850 lg:p-4"
      >
        <p className="text-xl font-bold text-violet-500 dark:text-white lg:text-2xl">
          Aucune facture à afficher
        </p>
        <button className={testDemoButtonTwClass} onClick={initializeDemo}>
          Tester la démo
        </button>
      </div>
    )

  return (
    <>
      {bills.some((bill: billProps) => bill.isDummy) && (
        <div
          role="row"
          className="grid bg-gray-100 px-2 pt-2 text-center dark:bg-violet-850 dark:pb-2"
        >
          <button
            className={testDemoButtonTwClass}
            onClick={() => dispatch(removeDummyBills(bills))}
          >
            Retirer les factures fictives
          </button>
        </div>
      )}
      <ol role="rowgroup" className={BillsListTwClass}>
        <AnimatePresence>
          {bills.map((bill: billProps) => (
            <BillsListItem key={bill.id} bill={bill} />
          ))}
        </AnimatePresence>
      </ol>
    </>
  )
}

export default BillsList
