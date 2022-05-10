import React, { useEffect, useRef, useState } from "react"
import { deleteBill, updateBill } from "@store/features/billsSlice"
import { useDispatch, useSelector } from "react-redux"

import BillStatus from "./BillStatus"
import { IconTrashOutline } from "./Icons.index"
import { RootState } from "@store/store"
import { billProps } from "@localTypes/billProps"
import classnames from "classnames"
import formatAmount from "@helpers/formatAmount"
import { motion } from "framer-motion"
import parseStringAmount from "@helpers/parseStringAmount"
import wait from "@helpers/wait"

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
  const dispatch = useDispatch()
  const boxRef = useRef<HTMLInputElement>(null)

  function updateItem() {
    if (bill[property] !== boxRef.current?.textContent) {
      if (!boxRef.current?.textContent) return null

      let value: string | number = boxRef.current?.textContent || ""
      if (property === "amount") value = parseStringAmount(value)
      if (property === "description") value = boxRef.current.innerText

      dispatch(
        updateBill({
          ...bill,
          [property]: value,
        })
      )
    }
  }

  return (
    <span
      className={`focus-ring-offset-0 transtion block rounded-sm px-1 py-1 outline-none ring-offset-1 transition-all duration-100 ease-in focus:ring focus:ring-violet-300 focus-visible:shadow-lg lg:flex-grow ${className} ${
        !bill.sentAt && "hover:bg-gray-200/60"
      }`}
      id="customer-editable"
      contentEditable={!bill.sentAt}
      suppressContentEditableWarning={true}
      onBlur={updateItem}
      ref={boxRef}
    >
      {children}
    </span>
  )
}

interface confirmDeleteBoxProps {
  billToDelete: billProps
  show: boolean
  setAskDeleteConfirmation: React.Dispatch<React.SetStateAction<boolean>>
}

function ConfirmDeleteBox({
  billToDelete,
  show,
  setAskDeleteConfirmation,
}: confirmDeleteBoxProps): JSX.Element {
  const dispatch = useDispatch()
  const deleteBoxRef = useRef<HTMLDivElement>(null)

  const classNames = classnames(
    "absolute flex flex-wrap items-center justify-center p-1 rounded-md inset-2 bg-violet-500 transition-all drop-shadow-md duration-300 gap-2 reveal z-10"
  )

  function removeBill() {
    dispatch(deleteBill(billToDelete))
  }

  useEffect(() => {
    ;(async function toggleDeleteBox(val = show) {
      if (show) {
        await wait()
        deleteBoxRef.current!.hidden = false
      }
      if (!show) {
        deleteBoxRef.current && deleteBoxRef.current.classList.add("hidding")
        await wait(1000)
        deleteBoxRef.current!.hidden = true
        deleteBoxRef.current!.classList.remove("hidding")
      }
    })()
  }, [show])

  return (
    <div className={classNames} ref={deleteBoxRef} hidden={true}>
      <h4 className="text-md font-semibold text-white">
        Supprimer la facture ?
      </h4>
      <div>
        <button
          className="button is-ghost mr-1 text-white"
          onClick={() => setAskDeleteConfirmation(false)}
        >
          Annuler
        </button>
        <button
          className="button is-filled bg-white bg-w-0/h-0 bg-center text-violet-500"
          onClick={removeBill}
        >
          Supprimer
        </button>
      </div>
    </div>
  )
}

function BillsListItem({ bill }: { bill: billProps }) {
  const [askDeleteConfirmation, setAskDeleteConfirmation] = useState(false)

  const billClassName = `
          px-1 dark:text-gray-200
        `

  return (
    <motion.li
      layout
      role="row"
      className={`grid-cols-bills relative grid items-center bg-white p-2 transition-[padding] duration-300 dark:bg-white/0 dark:bg-violet-850 lg:gap-2 lg:px-0 ${
        askDeleteConfirmation ? "lg:py-3" : "lg:py-0"
      } `}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 24, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className={`${billClassName} <lg:-order-1`} role="cell">
        <EditableBox
          bill={bill}
          property="customer"
          className="font-semibold text-gray-900 dark:text-white/90 "
        >
          {bill.customer}
        </EditableBox>
        <EditableBox
          bill={bill}
          property="amount"
          className="-m text-gray-600 dark:text-white/70 <lg:hidden xl:hidden "
        >
          {bill.description || ""}
        </EditableBox>
      </h3>

      <p
        className={`${billClassName} text-right text-gray-600 dark:text-white/70  <lg:-order-1`}
        role="cell"
      >
        <EditableBox bill={bill} property="amount">
          {formatAmount(bill.amount)}
        </EditableBox>
      </p>

      <p
        className={`${billClassName} text-gray-600 dark:text-white/70  <lg:col-span-3  <lg:-mt-2 lg:hidden xl:block`}
        role="cell"
      >
        <EditableBox bill={bill} property="description">
          {bill.description || ""}
        </EditableBox>
      </p>

      <div
        role="cell"
        className={`${billClassName} text-gray-600 <lg:col-span-3 <lg:mt-2 lg:py-2 lg:pl-0`}
      >
        <BillStatus bill={bill} />
      </div>

      <div
        role="cell"
        className={`${billClassName} flex flex-col  self-stretch <lg:-order-1`}
      >
        <button
          className={`button is-ghost ${
            askDeleteConfirmation && "scale-0"
          } ml-auto grow rounded-none from-violet-500 to-violet-500  bg-w-0/h-full bg-right-top text-2xl lg:static lg:-mr-1`}
          onClick={() => setAskDeleteConfirmation(true)}
        >
          <IconTrashOutline />
        </button>
      </div>

      <ConfirmDeleteBox
        show={askDeleteConfirmation}
        billToDelete={bill}
        setAskDeleteConfirmation={setAskDeleteConfirmation}
      />
    </motion.li>
  )
}

export default BillsListItem
