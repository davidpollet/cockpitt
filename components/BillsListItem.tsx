import React, { MouseEvent, useRef, useState } from "react"
import { useDeleteBill, useUpdateBill } from "@hooks/billsHooks"

import BillStatus from "./BillStatus"
import { IconTrashOutline } from "./Icons.index"
import ItemDeleteDialog from "./ItemDeleteDialog"
import Loading from "./Loading"
import { billProps } from "@localTypes/billProps"
import classnames from "classnames"
import formatAmount from "@helpers/formatAmount"
import isValidNumber from "@helpers/isValidNumber"
import { motion } from "framer-motion"
import parseStringAmount from "@helpers/parseStringAmount"
import showToast from "@helpers/showToast"

const descriptionPlaceholder = "Entrez votre description"
const descriptionPlaceholderOpacity = "opacity-60"

function BillsListItem({ bill }: { bill: billProps }) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const { deleteBill, isDeleting } = useDeleteBill()

  const BillListItemTwClass = React.useMemo(
    () =>
      classnames([
        `grid-cols-bills relative grid items-center bg-white p-2 transition-[padding] duration-300 text-gray-600`,
        `dark:bg-violet-800 dark:text-violet-100`,
        `lg:gap-2 lg:px-0`,
        `${showDeleteConfirmation ? "lg:py-3" : "lg:py-0"}`,
      ]),
    [showDeleteConfirmation],
  )

  const removeBillButtonTwClass = React.useMemo(
    () =>
      classnames(
        `button is-ghost ml-auto grow rounded-none from-violet-500 to-violet-500
      bg-w-0/h-full bg-right-top text-2xl`,
        `dark:text-violet-100`,
        `${showDeleteConfirmation && "scale-0"}`,
      ),
    [showDeleteConfirmation],
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
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <IconTrashOutline />
          </button>
        )}
      </div>

      <ItemDeleteDialog
        question="Supprimer cette facture ?"
        itemToDelete={bill}
        dialogIsVisible={showDeleteConfirmation}
        setDialogIsVisible={setShowDeleteConfirmation}
        deleteFn={deleteBill}
        isDeleting={isDeleting}
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

  function showNonEditableBoxAlert(event: MouseEvent) {
    const boxTarget = event.target as HTMLSpanElement
    if (boxTarget.contentEditable === "false") {
      showToast(
        "La facture n'est plus éditable depuis qu'elle a été envoyée",
        "",
      )
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
      onClick={showNonEditableBoxAlert}
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

export default BillsListItem
