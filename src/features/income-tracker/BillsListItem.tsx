import React, { useState } from "react"

import { Bill } from "./Bill"
import { BillStatus } from "./BillStatus"
import { IconPdf } from "src/ui/icons/Pdf"
import { IconTrashOutline } from "src/ui/icons/Trash"
import { IconsEdit } from "src/ui/icons/Edit"
import ItemDeleteDialog from "src/ui/ItemDeleteDialog"
import Spinner from "src/ui/Spinner"
import { User } from "../user-auth/User"
import { addTax } from "./addTax"
import { calcBillSum } from "./calcBillSum"
import cn from "classnames"
import { formatAmount } from "src/lib/utils/formatAmount"
import { generatePdfFromComponent } from "src/lib/utils/generatePdfFromComponent"
import { getPdfBillName } from "src/lib/utils/getPdfBillName"
import { motion } from "framer-motion"
import { showToast } from "src/lib/utils/showToast"
import { useBill } from "./useBill"
import { useFormModalBill } from "./IncomesTracker"
import { useUser } from "../user-auth/useUser"

const emptyCellStyle =
  "empty:before:block empty:before:h-1 empty:before:w-3/5 empty:before:rounded-full empty:before:bg-black/10 dark:empty:before:bg-white/20 empty:py-4"

export function BillsListItem({ bill }: { bill: Bill }) {
  const { user, dummyUser } = useUser()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const { deleteBill, isUpdating: isDeleting } = useBill(bill.id)
  const [isBuildingPDF, setIsBuildingPDF] = useState(false)
  const amountHT = React.useMemo(
    () => addTax(calcBillSum(bill), bill.taxRate),
    [bill],
  )
  const { openBillForm } = useFormModalBill()

  const [isComplete, setIsComplete] = React.useState(() =>
    checkBillisComplete(bill, user),
  )
  async function handlePdfDownload() {
    setIsBuildingPDF(true)
    const BillPdf = (await import("./BillPdf")).default
    await generatePdfFromComponent(
      <BillPdf user={bill.isDummy ? dummyUser : (user as User)} bill={bill} />,
      getPdfBillName(bill),
    ).finally(() => setIsBuildingPDF(false))
  }

  React.useEffect(() => {
    setIsComplete(() => checkBillisComplete(bill, user))
  }, [bill, user])

  return (
    <motion.li
      layout="position"
      role="row"
      className={`grid-cols-bills relative grid items-center bg-white px-2 pt-2 text-gray-600 transition-[padding] duration-300 dark:bg-violet-800 dark:text-violet-100 xl:gap-3 ${
        showDeleteConfirmation ? "lg:py-3" : "lg:py-2"
      }`}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 24, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h3
        className={`col-bills-customer font-semibold text-gray-900 dark:text-white ${emptyCellStyle}`}
        role="cell"
      >
        {bill.customer.name}
      </h3>

      <p className="col-bills-amount text-right" role="cell">
        {formatAmount(amountHT)}
      </p>

      <p
        className={`col-bills-description leading-tight ${emptyCellStyle}`}
        role="cell"
      >
        {bill.description}
      </p>

      <div role="cell" className={`col-bills-status <lg:mt-2 <lg:mb-4`}>
        <BillStatus bill={bill} />
      </div>

      <div
        role="cell"
        className={`col-bills-actions relative -mx-2 flex self-stretch rounded-b-inherit <md:dark:bg-black/10 md:-mt-2 md:rounded-bl-none md:pl-2 lg:-mb-2 xl:rounded-tr-inherit`}
      >
        <button
          className={`button is-ghost relative ml-auto grow flex-col justify-center gap-0 rounded-none rounded-bl-inherit from-violet-500 to-violet-500 bg-w-full/h-0 bg-bottom
          hover:bg-w-full/h-full dark:text-violet-100 <sm:px-1`}
          disabled={isBuildingPDF || !isComplete}
          onClick={handlePdfDownload}
        >
          <IconPdf
            className={cn("h-6 w-6 before:absolute ", {
              "opacity-0": isBuildingPDF,
            })}
          />
          {!isComplete && <IncompleteMarker />}
          <span className="text-sm xl:sr-only">Télécharger</span>
          <Spinner
            color={{ dark: "white", light: "violet" }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 ${
              isBuildingPDF
                ? "opacity-1 -translate-y-1/2 scale-100"
                : "translate-y-full scale-50 opacity-0"
            }`}
            size={24}
          />
        </button>
        <button
          className={`button is-ghost ml-auto grow justify-center rounded-none from-violet-500 to-violet-500 bg-w-full/h-0 bg-bottom
          hover:bg-w-full/h-full dark:text-violet-100 <sm:px-1 ${
            bill.sentAt
              ? "opacity-50 hover:cursor-default hocus:bg-w-0/h-0"
              : ""
          }`}
          onClick={() =>
            bill.sentAt
              ? showToast(
                  'Édition impossible, la facture est marquée comme "envoyée".',
                  "info",
                )
              : openBillForm(bill.id)
          }
        >
          <IconsEdit className="h-6 w-6" />
          <span className="text-sm xl:sr-only">Éditer</span>
        </button>

        <button
          className={`button is-ghost ml-auto grow justify-center rounded-none rounded-br-inherit from-violet-500 to-violet-500 bg-w-full/h-0 bg-bottom hover:bg-w-full/h-full dark:text-violet-100 <sm:px-1 xl:rounded-tr-inherit ${
            showDeleteConfirmation && "scale-0"
          } ${
            bill.sentAt
              ? "opacity-50 hover:cursor-default hocus:bg-w-0/h-0"
              : ""
          }`}
          onClick={() =>
            bill.sentAt
              ? showToast(
                  'Suppression impossible, la facture est marquée comme "envoyée".',
                  "info",
                )
              : setShowDeleteConfirmation(true)
          }
        >
          <IconTrashOutline className="h-6 w-6" />
          <span className="text-sm xl:sr-only">Supprimer</span>
        </button>
      </div>

      <ItemDeleteDialog<Bill>
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

function IncompleteMarker() {
  return (
    <>
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-8 w-[2px]  -translate-y-1/2 -translate-x-1/2 rotate-45 bg-currentColor"
      ></div>
      <span className="absolute bottom-1 -translate-y-1 text-xs font-bold uppercase leading-none">
        <span className="inline-block h-3 w-3 -translate-y-1 rounded-full bg-yellow-200 font-bold leading-3 text-yellow-800">
          !
        </span>
        Incomplet
      </span>
    </>
  )
}

export function checkBillisComplete(bill: Bill, user: User) {
  if (bill.isDummy) return true
  if (
    !user?.society?.adress ||
    !user?.society?.name ||
    !user?.society?.siren ||
    !bill?.customer?.adress ||
    !bill?.customer?.name ||
    !bill?.customer?.siren ||
    !bill?.number ||
    bill?.services.length === 0
  ) {
    return false
  }
  return true
}
