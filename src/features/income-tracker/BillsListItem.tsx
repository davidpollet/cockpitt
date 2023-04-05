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
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const { deleteBill, isUpdating: isDeleting } = useBill(bill.id)
  const amountHT = React.useMemo(
    () => addTax(calcBillSum(bill), bill.taxRate),
    [bill],
  )

  return (
    <motion.li
      layout="position"
      className={`grid-cols-bills xl-pt-0 relative grid rounded-md bg-white px-2 pt-2 text-gray-600 transition-[padding]
      duration-300 dark:bg-violet-800  dark:text-violet-100 xl:items-center xl:gap-3 xl:rounded-none xl:text-sm 2xl:text-base
      ${showDeleteConfirmation ? "lg:py-3" : "lg:py-2"}`}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 24, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h3
        className={`col-bills-customer font-semibold text-gray-900 dark:text-white ${emptyCellStyle}`}
      >
        {bill.customer.name}
      </h3>

      <p className="col-bills-amount text-right">{formatAmount(amountHT)}</p>

      <p className={`col-bills-description leading-tight ${emptyCellStyle}`}>
        {bill.description}
      </p>

      <div className={`col-bills-status -mr-2 py-4 sm:self-center sm:py-0`}>
        <BillStatus bill={bill} />
      </div>

      <div className="col-bills-actions relative flex rounded-b-inherit <sm:-mx-2 sm:ml-8 sm:-mr-2 sm:rounded-bl-none lg:-mb-2 <xl:dark:bg-white/10 xl:-mt-2 xl:ml-0 xl:self-stretch xl:rounded-tr-inherit">
        <DownloadBillButton bill={bill} />
        <EditBillButton bill={bill} />
        <DeleteBillButton
          bill={bill}
          showDeleteConfirmation={showDeleteConfirmation}
          setShowDeleteConfirmation={setShowDeleteConfirmation}
        />
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

function DownloadBillButton({ bill }: { bill: Bill }) {
  const [isBuildingPDF, setIsBuildingPDF] = React.useState(false)
  const { dummyUser, user } = useUser()
  async function handlePdfDownload() {
    setIsBuildingPDF(true)
    const BillPdf = (await import("./BillPdf")).default
    await generatePdfFromComponent(
      <BillPdf user={bill.isDummy ? dummyUser : (user as User)} bill={bill} />,
      getPdfBillName(bill),
    ).finally(() => setIsBuildingPDF(false))
  }

  return (
    <button
      className={`button is-ghost relative ml-auto grow flex-col justify-center gap-0 rounded-none rounded-bl-inherit from-violet-500 to-violet-500 bg-w-full/h-0 bg-bottom
          hover:bg-w-full/h-full dark:text-violet-100 <sm:px-1`}
      onClick={handlePdfDownload}
    >
      <IconPdf
        className={cn("h-6 w-6 before:absolute ", {
          "opacity-0": isBuildingPDF,
        })}
      />
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
  )
}

function EditBillButton({ bill }: { bill: Bill }) {
  const { openBillForm } = useFormModalBill()

  return (
    <button
      className={`button is-ghost ml-auto grow flex-col justify-center rounded-none from-violet-500 to-violet-500 bg-w-full/h-0 bg-bottom
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
  )
}

function DeleteBillButton({
  bill,
  showDeleteConfirmation,
  setShowDeleteConfirmation,
}: {
  bill: Bill
  showDeleteConfirmation: boolean
  setShowDeleteConfirmation: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <button
      className={`button is-ghost ml-auto grow flex-col justify-center rounded-none rounded-br-inherit from-violet-500 to-violet-500 bg-w-full/h-0 bg-bottom hover:bg-w-full/h-full dark:text-violet-100 <sm:px-1 xl:rounded-tr-inherit ${
        showDeleteConfirmation && "scale-0"
      } ${
        bill.sentAt ? "opacity-50 hover:cursor-default hocus:bg-w-0/h-0" : ""
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
  )
}
