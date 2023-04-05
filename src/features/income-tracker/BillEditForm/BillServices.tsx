import { Bill, Service } from "../Bill"

import { BillFormErrorHint } from "."
import { FormData } from "./BillFormData"
import { IconPlus } from "src/ui/icons/Plus"
import { IconTrashOutline } from "src/ui/icons/Trash"
import React from "react"
import { formatAmount } from "src/lib/utils/formatAmount"
import { nanoid } from "nanoid"
import parseString from "src/lib/utils/parseStringAmount"
import { useBillFormContext } from "./billFormContext"
import wait from "src/lib/utils/wait"

export function BillServices() {
  const { bill, setBill } = useBillFormContext()
  const lastServiceRowRef = React.useRef<HTMLInputElement | null>(null)

  function addNewServiceRow() {
    if (!bill?.id) return
    const newRow: Service = {
      detail: "",
      id: nanoid(),
      price: 0,
      quantity: 1,
    }

    const billWithNewServiceRow: Bill = {
      ...bill,
      services: [...bill.services, newRow],
    }

    setBill(billWithNewServiceRow)
  }

  return (
    <div className="relative z-10 -ml-2 overflow-auto pl-2 <sm:-mr-4 sm:-mr-8 lg:mr-0">
      <table className="mt-8 w-full">
        <thead>
          <tr>
            <th className="min-w-[15ch] text-left font-sans text-black">Prestation</th>
            <th className="w-14 px-1 py-1 text-right font-sans text-black">
              <abbr title="quantity">Qté</abbr>
            </th>
            <th className="w-20 whitespace-nowrap px-1 py-1 text-right font-sans text-black">
              Prix Unitaire
            </th>
            <th className="w-28 whitespace-nowrap px-1 py-1 text-right font-sans text-black">
              Total HT
            </th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {bill?.services.map((row, index) => (
            <BillRow
              key={row.id}
              row={row}
              ref={index === bill.services.length - 1 ? lastServiceRowRef : null}
            />
          ))}
        </tbody>
      </table>
      <hr />

      <button
        className="button is-ghost bg-w-0/h-full bg-left font-sans"
        onClick={addNewServiceRow}
        type="button"
      >
        <IconPlus /> Ajouter une ligne
      </button>
    </div>
  )
}

const BillRow = React.forwardRef<HTMLInputElement, { row: Service }>(function BillRow(
  { row },
  ref,
) {
  const { invalidNamesInputs, setBill, bill } = useBillFormContext()
  const [showDeleteRow, setShowDeleteRow] = React.useState(false)
  const sum = row.price * row.quantity
  const deleteRowRef = React.useRef<HTMLTableCellElement>(null)

  React.useEffect(() => {
    async function toggleDeleteBox() {
      if (showDeleteRow) {
        deleteRowRef?.current?.classList.remove("hidden")
        deleteRowRef?.current?.classList.add("flex")
      }
      if (!showDeleteRow) {
        deleteRowRef?.current?.classList.add("hidding")
        await wait(1000)
        deleteRowRef?.current?.classList.add("hidden")
        deleteRowRef?.current?.classList.remove("hidding", "flex")
      }
    }
    toggleDeleteBox()
  }, [showDeleteRow])

  function removeRow() {
    if (typeof bill === "undefined") return null
    setBill({
      ...bill,
      services: bill?.services.filter((s) => s.id !== row.id),
    })
  }

  type BillInput = keyof Pick<Bill["services"][number], "quantity" | "price" | "detail">

  function handleChange(type: BillInput, value: string) {
    if (typeof bill === "undefined") return
    const updatedRow: Service = {
      ...row,
    }

    switch (type) {
      case "detail":
        if (value.trim().length === 0) return
        updatedRow.detail = value
        break
      case "price":
        updatedRow.price = parseString(value)
        break
      case "quantity": {
        const parsedQty = Number(value)
        if (isNaN(parsedQty) || parsedQty < 1) {
          return
        } else {
          updatedRow.quantity = parseString(value)
          break
        }
      }

      default: {
        const n: never = type
        throw n
      }
    }

    setBill({
      ...bill,
      services: [
        ...bill.services.map((service) => (service.id === row.id ? updatedRow : service)),
      ],
    })
  }

  return (
    <tr className="border-t-1 relative <md:-translate-x-1">
      <td>
        <input
          autoFocus
          className="h-8 w-full min-w-[15ch] resize-none rounded-sm px-1 py-2 outline-none transition-all duration-100 ease-in focus:ring-2 focus:ring-violet-300 focus-visible:shadow-lg"
          data-id={row.id}
          data-prop={"details"}
          name={`${FormData.serviceDetails}_${row.id}`}
          onChange={(e) => handleChange("detail", e.target.value)}
          onFocus={(e) => e.currentTarget.select()}
          placeholder={"Détail de la prestation"}
          ref={ref}
          required
          defaultValue={row.detail}
        />
        {invalidNamesInputs.includes(`${FormData.serviceDetails}_${row.id}`) && (
          <BillFormErrorHint message="Champs Requis" />
        )}
      </td>
      <td className="w-14">
        <input
          className="w-full rounded-sm px-1 py-2 text-right lining-nums outline-none transition-all duration-100 ease-in focus:ring-2 focus:ring-violet-300 focus-visible:shadow-lg"
          data-id={row.id}
          inputMode="numeric"
          name={`${FormData.serviceQuantity}_${row.id}`}
          onChange={(e) => handleChange("quantity", e.target.value)}
          onFocus={(e) => e.currentTarget.select()}
          pattern="\d+"
          placeholder={"1"}
          required
          type="text"
          defaultValue={row.quantity}
        />
        {invalidNamesInputs.includes(`${FormData.serviceQuantity}_${row.id}`) && (
          <BillFormErrorHint message="Champs Requis" />
        )}
      </td>
      <td className="w-20 text-right">
        <input
          className="w-full rounded-sm px-1 py-2 text-right lining-nums outline-none transition-all duration-100 ease-in focus:ring-2 focus:ring-violet-300 focus-visible:shadow-lg"
          type="text"
          inputMode="decimal"
          defaultValue={formatAmount(Number(row.price))}
          onFocus={(e) => e.currentTarget.select()}
          placeholder={"0,00€"}
          required
          onBlur={(e) =>
            (e.currentTarget.value = formatAmount(parseString(e.currentTarget.value)))
          }
          data-id={row.id}
          onChange={(e) => handleChange("price", e.target.value)}
          name={`${FormData.servicePrice}_${row.id}`}
        />
        {invalidNamesInputs.includes(`${FormData.servicePrice}_${row.id}`) && (
          <BillFormErrorHint message="Champs Requis" />
        )}
      </td>
      <td className="w-28 px-1 py-2 text-right lining-nums">{formatAmount(sum)}</td>
      <td className="w-12 text-center">
        <button
          className={`button is-ghost p-2 ${
            bill?.services.length && "text-currentColor"
          }`}
          disabled={bill?.services.length === 1}
          onClick={() => setShowDeleteRow(true)}
          type="button"
        >
          <IconTrashOutline />
        </button>
      </td>
      <td
        className={`bill-delete-dialog absolute inset-2 z-10 -mx-1 -my-2 hidden flex-wrap items-center justify-center gap-2 rounded-md bg-violet-500 p-1 font-sans text-sm text-white drop-shadow-md transition-all duration-300`}
        ref={deleteRowRef}
      >
        <div>
          <button
            className="button is-ghost mr-1 py-1 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:from-violet-400 dark:to-violet-400"
            onClick={() => setShowDeleteRow(false)}
            type="button"
          >
            Annuler
          </button>
          <button
            className="button is-filled relative bg-white bg-w-0/h-0 bg-center py-1 text-violet-500 "
            onClick={removeRow}
            type="button"
          >
            Supprimer la ligne
          </button>
        </div>
      </td>
    </tr>
  )
})
