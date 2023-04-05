import { BillFormErrorHint, BillFormLegend, billFormInputStyle } from "."

import { Bill } from "../Bill"
import { FormData } from "./BillFormData"
import { InputAutoWidth } from "src/ui/InputAutoWidth"
import React from "react"
import { getRelativeTimeDate } from "src/lib/utils/getRelativeTime"
import { useBillFormContext } from "./billFormContext"
import { useBills } from "../useBills"

type InputInfos = keyof Pick<Bill, "number" | "description">

export function BillInfos() {
  const { bills } = useBills()
  const { invalidNamesInputs, bill, setBill } = useBillFormContext()
  const [billNumberErrorMessage, setBillNumberErrorMessage] = React.useState("")
  const billCreatedDate = Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
  }).format(bill?.createdAt)
  function checkNumberHasError(value: string) {
    const isEmpty = value === ""
    const isNotNumber = isNaN(Number(value))
    return isEmpty || isNotNumber
  }

  function handleChangeInput(value: string, type: InputInfos) {
    if (!bill?.id) return
    if (type === "number") {
      const valueIsWrong = checkNumberHasError(value)
      if (valueIsWrong)
        return setBillNumberErrorMessage("Le numéro de facture doit être un chiffre")

      const numberExist = bills.some(
        (b) => b.number === Number(value) && b.id !== bill.id,
      )
      if (numberExist)
        return setBillNumberErrorMessage("Une facture avec ce numéro existe")
      setBill({ ...bill, number: Number(value) })
      setBillNumberErrorMessage("")
    } else if (type === "description") {
      setBill({ ...bill, description: value })
    } else {
      throw new Error("shoud not happen")
    }
  }

  return (
    <fieldset className="grid gap-1">
      <BillFormLegend className="contents">Votre facture</BillFormLegend>
      <label className="justify-self-start font-sans font-bold text-black">
        Facture N°
        <InputAutoWidth
          inputMode="numeric"
          className={`${billFormInputStyle} text-[inherit]`}
          onChange={(e) => handleChangeInput(e.currentTarget.value, "number")}
          value={bill?.number}
          name={FormData.billNumber}
          required
          pattern="\d+"
        />
        {invalidNamesInputs.includes(FormData.billNumber) && (
          <BillFormErrorHint message="Numéro de facture requis" />
        )}
        {billNumberErrorMessage && <BillFormErrorHint message={billNumberErrorMessage} />}
      </label>
      <ul className="grid gap-1">
        <li>Date d'émission : {billCreatedDate || getRelativeTimeDate(0)}</li>
        <li>
          <label>
            <p className="flex items-baseline gap-2 font-sans">
              <span className="font-bold text-black">Description</span>{" "}
              <span className="text-sm">Invisible sur la facture</span>
            </p>
            <input
              type="text"
              className={`${billFormInputStyle} mt-1 w-full bg-gray-100`}
              value={bill?.description}
              placeholder="Ex: refonte du site web"
              onChange={(e) => handleChangeInput(e.currentTarget.value, "description")}
              name="bill_description"
            />
          </label>
        </li>
      </ul>
    </fieldset>
  )
}
