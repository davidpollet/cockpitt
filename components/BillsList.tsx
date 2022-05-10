import { addDummyBills, removeDummyBills } from "@store/features/billsSlice"
import { useDispatch, useSelector } from "react-redux"

import { AnimatePresence } from "framer-motion"
import BillsListItem from "./BillsListItem"
import { RootState } from "@store/store"
import { billProps } from "@localTypes/billProps"
import dummyBills from "@consts/dummyBills"

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
      <div role="row" className="grid gap-2 p-2 text-center lg:p-4">
        <p className="text-xl font-bold text-violet-500 dark:text-white lg:text-2xl">
          Aucune facture à afficher
        </p>
        <button
          className="button is-filled justify-self-center bg-gradient-to-r dark:bg-violet-150 dark:from-violet-500 dark:to-violet-500 dark:text-violet-800 dark:hover:text-violet-100"
          onClick={initializeDemo}
        >
          Tester la démo
        </button>
      </div>
    )

  return (
    <>
      {bills.some((bill: billProps) => bill.isDummy) && (
        <div
          role="row"
          className=" grid bg-gray-100 px-2 pt-2 text-center dark:bg-violet-850 dark:pb-2"
        >
          <button
            className="button is-filled justify-self-center bg-gradient-to-r dark:bg-violet-150 dark:from-violet-500 dark:to-violet-500 dark:text-violet-800 dark:hover:text-violet-100"
            onClick={() => dispatch(removeDummyBills(bills))}
          >
            Retirer les factures fictives
          </button>
        </div>
      )}
      <ol
        role="rowgroup"
        className="grid gap-[1px] overflow-hidden bg-gray-100/80 p-1 pb-2 transition-all duration-300 ease-in-out dark:bg-violet-800 dark:p-0 lg:px-2 lg:pt-2"
      >
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
