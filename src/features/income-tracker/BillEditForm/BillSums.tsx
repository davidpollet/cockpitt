import { addTax, taxRates } from "../addTax"
import { formatAmount, formatPercent } from "src/lib/utils/formatAmount"

import { IconChevronDown } from "src/ui/icons/ChevronDown"
import { Listbox } from "@headlessui/react"
import { calcBillSum } from "../calcBillSum"
import { useBillFormContext } from "./billFormContext"

export function BillSums() {
  const { bill, setBill, user, setUser } = useBillFormContext()
  if (!bill || !user) return null
  const sumHT = bill ? calcBillSum(bill) : 0
  const sumTTC = sumHT ? addTax(sumHT, bill?.taxRate) : 0

  return (
    <div className="relative z-30 ml-auto w-full max-w-[30ch] bg-gray-100 p-2">
      <div className="flex justify-between">
        <h3 className="pr-2 font-sans text-black">Total HT</h3>
        <p className="text-right lining-nums">{formatAmount(sumHT)}</p>
      </div>
      <Listbox
        value={bill.taxRate || taxRates.at(0)}
        onChange={(newTax) => {
          setBill({ ...bill, taxRate: newTax })
          setUser({ ...user, taxRate: newTax })
        }}
        name="bill_taxRate"
      >
        <Listbox.Button
          className={
            "button w-full py-1 px-0 ring-offset-1 transition duration-100 ease-in hover:bg-black/5 focus:ring-2 focus:ring-violet-300 focus-visible:shadow-lg"
          }
        >
          <span className="grow pr-2 text-left font-sans text-black">T.V.A</span>
          {formatPercent(bill.taxRate)} <IconChevronDown />
        </Listbox.Button>
        <div className="relative">
          <Listbox.Options className="absolute right-0 top-0 rounded bg-white text-gray-600 shadow-lg outline-none  transition duration-100 ease-in focus:ring-2 focus:ring-violet-400">
            {taxRates.map((tax) => (
              <Listbox.Option
                key={tax}
                value={tax}
                className={({ active, selected }) =>
                  `relative cursor-pointer select-none bg-gradient-to-r from-violet-400 to-violet-400 bg-w-0/h-full bg-no-repeat py-1 px-2 lining-nums  transition-[background_color] hocus:bg-w-full/h-full ${
                    active ? "bg-w-full/h-full !text-white" : ""
                  } ${selected ? "font-bold text-black" : ""}`
                }
              >
                {formatPercent(tax)}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      <div className="flex justify-between">
        <h3 className="pr-2 font-sans font-bold text-black">Total</h3>
        <p className="text-right font-bold lining-nums text-black">
          {formatAmount(sumTTC)}
        </p>
      </div>
      {bill?.taxRate === 0 && <p>TVA non applicable, article 293B du CGI</p>}
    </div>
  )
}
