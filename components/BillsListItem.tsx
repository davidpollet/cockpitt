import React, { useEffect, useRef, useState } from "react"
import { useDeleteBill, useUpdateBill } from "@hooks/billsHooks"

import BillStatus from "./BillStatus"
import { IconTrashOutline } from "./Icons.index"
import Loading from "./Loading"
import { billProps } from "@localTypes/billProps"
import classnames from "classnames"
import formatAmount from "@helpers/formatAmount"
import isValidNumber from "@helpers/isValidNumber"
import { motion } from "framer-motion"
import parseStringAmount from "@helpers/parseStringAmount"
import showToast from "@helpers/showToast"
import wait from "@helpers/wait"

const descriptionPlaceholder = "Entrez votre description"
const descriptionPlaceholderOpacity = "opacity-60"

function BillsListItem({ bill }: { bill: billProps }) {
  const [askDeleteConfirmation, setAskDeleteConfirmation] = useState(false)

  const BillListItemTwClass = React.useMemo(
    () =>
      classnames([
        `grid-cols-bills relative grid items-center bg-white p-2 transition-[padding] duration-300 text-gray-600`,
        `dark:bg-violet-800 dark:text-violet-100`,
        `lg:gap-2 lg:px-0`,
        `${askDeleteConfirmation ? "lg:py-3" : "lg:py-0"}`,
      ]),
    [askDeleteConfirmation]
  )

  const removeBillButtonTwClass = React.useMemo(
    () =>
      classnames(
        `button is-ghost ml-auto grow rounded-none from-violet-500 to-violet-500
      bg-w-0/h-full bg-right-top text-2xl`,
        `dark:text-violet-100`,
        `${askDeleteConfirmation && "scale-0"}`
      ),
    [askDeleteConfirmation]
  )

  return (
    <motion.li
      layout="position"
      role="row"
      className={BillListItemTwClass}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 24, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className={`col-bills-customer pl-1`} role="cell">
        <EditableBox
          bill={bill}
          property="customer"
          className="font-semibold text-gray-900 dark:text-white"
        >
          {bill.customer}
        </EditableBox>
      </h3>

      <p className={`col-bills-amount`} role="cell">
        <EditableBox bill={bill} property="amount" className="text-right">
          {formatAmount(bill.amount)}
        </EditableBox>
      </p>

      <p
        className={`col-bills-description ${
          !bill.description && "text-opacity-50"
        }`}
        role="cell"
      >
        <EditableBox
          bill={bill}
          property="description"
          className={`${!bill.description && descriptionPlaceholderOpacity}`}
        >
          {bill.description || "Entrez votre description"}
        </EditableBox>
      </p>

      <div role="cell" className={`col-bills-status <lg:mt-2 lg:py-2 lg:pl-0`}>
        <BillStatus bill={bill} />
      </div>

      <div
        role="cell"
        className={`col-bills-delete relative flex flex-col self-stretch`}
      >
        {!bill.cashedAt && (
          <button
            className={removeBillButtonTwClass}
            onClick={() => setAskDeleteConfirmation(true)}
          >
            <IconTrashOutline />
          </button>
        )}
      </div>

      <BillDeleteDialog
        show={askDeleteConfirmation}
        billToDelete={bill}
        setAskDeleteConfirmation={setAskDeleteConfirmation}
      />
    </motion.li>
  )
}

function EditableBox({
  children,
  className = "",
  bill,
  property,
}: {
  children: string
  className?: string
  bill: billProps
  property: "customer" | "amount" | "description"
}) {
  const boxRef = useRef<HTMLInputElement>(null)
  const { updateBill, isUpdating } = useUpdateBill()

  async function updateItem() {
    if (property === "description") {
      const box = boxRef.current
      if (box?.textContent === descriptionPlaceholder) return
      if (box?.textContent === "") {
        box.textContent = descriptionPlaceholder
        box.classList.add(descriptionPlaceholderOpacity)
        return
      }
    }
    if (bill[property] !== boxRef.current?.textContent) {
      let value: string | number = boxRef.current?.textContent || ""
      if (property === "customer") {
        if (value === "" && boxRef?.current) {
          boxRef.current.textContent = bill.customer
          return showToast("Le champ client doit être rempli", "error")
        }
      }
      if (property === "amount" && boxRef?.current) {
        const amount = value.replaceAll(/\s|€/g, "")
        const amountIsValid = isValidNumber(amount)
        if (!amountIsValid) {
          boxRef.current.textContent = formatAmount(bill.amount)
          return showToast("Le montant n'est pas valide", "error")
        }

        boxRef.current.textContent = formatAmount(parseFloat(amount))
        value = parseStringAmount(value)
      }
      if (property === "description") value = boxRef?.current?.innerText || ""

      if (bill[property] === value) return

      const updatedBill = { ...bill, [property]: value }
      updateBill(updatedBill)
    }
  }

  function removeDescriptionPlaceholder() {
    if (boxRef.current?.textContent === descriptionPlaceholder) {
      boxRef.current.textContent = ""
      boxRef.current.classList.remove(descriptionPlaceholderOpacity)
    }
  }

  const editableBoxClassName = `block relative rounded-sm px-1 py-1 outline-none
  transition-all duration-100 ease-in focus:ring-2
  focus:ring-violet-300 focus-visible:shadow-lg lg:flex-grow
  ${className} ${!bill.sentAt && "hover:bg-gray-200/60 dark:hover:bg-white/10"}`

  return (
    <span
      className={editableBoxClassName}
      id="customer-editable"
      contentEditable={!bill.sentAt || property === "description"}
      suppressContentEditableWarning={true}
      onBlur={updateItem}
      ref={boxRef}
      onFocus={removeDescriptionPlaceholder}
    >
      <Loading
        className={`absolute top-1/2 right-1 -translate-x-2/4 transition-all ${
          isUpdating ? "opacity-100" : "opacity-0"
        }`}
        size={12}
      />
      {children}
    </span>
  )
}

interface billDeleteDialogProps {
  billToDelete: billProps
  show: boolean
  setAskDeleteConfirmation: React.Dispatch<React.SetStateAction<boolean>>
}

function BillDeleteDialog({
  billToDelete,
  show,
  setAskDeleteConfirmation,
}: billDeleteDialogProps) {
  const deleteBoxRef = useRef<HTMLDivElement>(null)
  const { deleteBill, isDeleting } = useDeleteBill()

  useEffect(() => {
    async function toggleDeleteBox() {
      if (show) {
        await wait(10)
        deleteBoxRef?.current?.classList.remove("hidden")
      }
      if (!show) {
        deleteBoxRef?.current?.classList.add("hidding")
        await wait(1000)
        deleteBoxRef?.current?.classList.add("hidden")
        deleteBoxRef?.current?.classList.remove("hidding")
      }
    }
    toggleDeleteBox()
    return () => {}
  }, [show])

  const deleteBoxClassName = `bill-delete-dialog absolute inset-2 z-10
  flex flex-wrap items-center justify-center gap-2 rounded-md
  bg-violet-500 p-1 drop-shadow-md transition-all duration-300
  dark:bg-violet-850 hidden`

  return (
    <div className={deleteBoxClassName} ref={deleteBoxRef}>
      <h4 className="text-md font-semibold text-white">
        Supprimer la facture ?
      </h4>
      <div>
        <button
          className="button is-ghost mr-1 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:from-violet-400 dark:to-violet-400"
          onClick={() => setAskDeleteConfirmation(false)}
        >
          Annuler
        </button>
        <button
          className="button is-filled relative bg-white bg-w-0/h-0 bg-center text-violet-500 dark:bg-violet-600 dark:text-violet-100"
          onClick={() => deleteBill(billToDelete)}
        >
          <Loading
            size={20}
            className={`absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 transition-all
            ${isDeleting ? "scale-1" : "scale-0"}`}
          />
          <span className={`${isDeleting && "opacity-0 transition-all "}`}>
            Supprimer
          </span>
        </button>
      </div>
    </div>
  )
}

export default BillsListItem
