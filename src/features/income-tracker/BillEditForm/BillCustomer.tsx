import { BillFormErrorHint, BillFormLegend, billFormInputStyle } from "."

import { Bill } from "../Bill"
import { Customer } from "src/features/user-auth/Customer"
import { FormData } from "./BillFormData"
import { REGEX_SIREN } from "src/lib/regex/siren"
import { useBillFormContext } from "./billFormContext"

export function BillCustomer() {
  const { invalidNamesInputs, setBill, bill, user } = useBillFormContext()

  function handleInputChange(type: keyof Customer, value: string) {
    setBill({
      ...(bill as Bill),
      customer: { ...bill?.customer, [type]: value } as Customer,
    })
  }

  return (
    <fieldset className="grid items-start gap-1 bg-gray-100 p-2">
      <BillFormLegend className="contents">Votre client</BillFormLegend>
      <label>
        <span className="sr-only">Nom du client :</span>
        <input
          className={`${billFormInputStyle} w-full bg-transparent font-sans font-bold text-black`}
          placeholder="Nom de votre client"
          value={bill?.customer?.name}
          onChange={(e) => {
            if (!bill) return
            const inputValue = e.currentTarget.value
            const customer = user?.customers.find((c) => c.name === inputValue)
            if (customer) {
              setBill({
                ...bill,
                customer: {
                  adress: customer.adress,
                  name: inputValue,
                  siren: customer.siren,
                },
              })
              return
            }
            handleInputChange("name", e.currentTarget.value)
          }}
          name={FormData.customerName}
          list="customers"
          required
        />
        {invalidNamesInputs.includes(FormData.customerName) && (
          <BillFormErrorHint message="Nom du client requis" />
        )}
      </label>
      <label className="w-full">
        <span className="sr-only">Adresse du client</span>
        <input
          className={`${billFormInputStyle} w-full bg-transparent`}
          name={FormData.customerAdress}
          onChange={(e) => handleInputChange("adress", e.currentTarget.value)}
          placeholder="Adresse de votre client"
          required
          type="tel"
          value={bill?.customer?.adress}
        />
        {invalidNamesInputs.includes(FormData.customerAdress) && (
          <BillFormErrorHint message="Nom du client requis" />
        )}
      </label>
      <label className="flex">
        <span>SIREN :</span>
        <input
          className={`${billFormInputStyle} grow bg-transparent lining-nums`}
          name={FormData.customerSiren}
          onChange={(e) => handleInputChange("siren", e.currentTarget.value)}
          pattern={`${REGEX_SIREN}`.replaceAll("/", "")}
          placeholder="123 456 789"
          required
          type="tel"
          value={bill?.customer?.siren}
        />
        {invalidNamesInputs.includes(FormData.customerSiren) && (
          <BillFormErrorHint message="Le SIREN est requis et doit être de 9 chiffres" />
        )}
      </label>
    </fieldset>
  )
}
