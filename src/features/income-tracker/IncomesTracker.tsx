import { AnimatePresence } from "framer-motion"
import { Bill } from "./Bill"
import { BillsList } from "./BillsList"
import { IconPlus } from "src/ui/icons/Plus"
import Spinner from "src/ui/Spinner"
import { Turnovers } from "./Turnovers"
import { create } from "zustand"
import { createBill } from "./createBill"
import dynamic from "next/dynamic"
import { useBills } from "./useBills"
import { useUser } from "../user-auth/useUser"

type FormModalBill = {
  openedBillId: Bill["id"]
  openBillForm: (id: Bill["id"]) => void
  closeBillForm: () => void
}

export const useFormModalBill = create<FormModalBill>((set) => ({
  openedBillId: "",
  openBillForm: (id) => set((state) => ({ ...state, openedBillId: id })),
  closeBillForm: () => set((state) => ({ ...state, openedBillId: "" })),
}))

const BillForm = dynamic(() => import("./BillEditForm"), {
  loading: () => <Spinner />,
  ssr: false,
})

export function IncomesTracker() {
  const { openedBillId } = useFormModalBill()
  const billsLength = useBills().bills.length
  return (
    <div className="lg:grid lg:grid-cols-[1fr_auto] xl:gap-4">
      <div className="lg:order-2">
        <Turnovers />
      </div>
      <div className="grid gap-1 self-start rounded-md">
        {billsLength > 0 && <BillsActionsBar />}
        <BillsList />

        <AnimatePresence>{openedBillId ? <BillForm /> : null}</AnimatePresence>
      </div>
    </div>
  )
}

function BillsActionsBar() {
  return (
    <div className="flex gap-2 overflow-auto whitespace-nowrap py-1">
      <OpenNewBill />
      <RemoveDummyBillsButton />
    </div>
  )
}

function RemoveDummyBillsButton() {
  const { bills, removeDummyBills } = useBills()
  const hasDummyBills = bills.some((bill) => bill.isDummy)
  if (!hasDummyBills) return null
  return (
    <button
      className="button is-outline justify-self-center dark:from-violet-300 dark:to-violet-300 dark:text-violet-100 dark:ring-violet-100 dark:hover:text-violet-600"
      onClick={removeDummyBills}
    >
      Retirer les factures fictives
    </button>
  )
}

export function OpenNewBill() {
  const { user } = useUser()
  const { bills, addNewBill } = useBills()
  const { openBillForm } = useFormModalBill()
  const billNumber = bills.length + 1

  async function handleNewBillClick() {
    const newBill = createBill(user, billNumber)
    openBillForm(newBill.id)
    addNewBill(newBill)
  }
  return (
    <button className="button is-filled" onClick={handleNewBillClick}>
      <IconPlus />
      Créer une facture
    </button>
  )
}
