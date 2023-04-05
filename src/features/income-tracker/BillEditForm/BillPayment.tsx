import { BillFormErrorHint, billFormInputStyle } from "."

import { FormData } from "./BillFormData"
import { IconVisibilityOff } from "src/ui/icons/VisibilityOff"
import { IconVisibilityOn } from "src/ui/icons/VisibilityOn"
import { REGEX_BIC } from "src/lib/regex/bic"
import { REGEX_IBAN } from "src/lib/regex/iban"
import { User } from "src/features/user-auth/User"
import { useBillFormContext } from "./billFormContext"
import { useToggle } from "react-use"

export function BillPayment() {
  const [showValue, toggleShowValue] = useToggle(false)
  const { invalidNamesInputs, user, setUser } = useBillFormContext()

  type Input = keyof Pick<User, "iban" | "bic">
  async function handleInputChange(type: Input, value: string) {
    if (typeof user === "undefined") return
    setUser({ ...user, [type]: value })
  }

  return (
    <div className="px-2 <sm:order-2">
      <h3 className="font-sans font-bold text-black">Informations de paiement</h3>
      {user?.showPaymentInformation && (
        <table className="w-full border-separate border-spacing-y-2">
          <tbody>
            <tr>
              <td>
                <label htmlFor="bic">BIC</label>
              </td>
              <td>
                <div className="flex">
                  <input
                    type={showValue ? "text" : "password"}
                    className={`${billFormInputStyle} w-full bg-gray-100`}
                    value={user?.bic || ""}
                    onChange={(e) => handleInputChange("bic", e.currentTarget.value)}
                    onFocus={(e) => e.target.select()}
                    placeholder="CPPTFRP1"
                    id="bic"
                    name={FormData.userBic}
                    pattern={`${REGEX_BIC}`.replaceAll("/", "")}
                  />
                  <button
                    className="button is-ghost px-2"
                    onClick={toggleShowValue}
                    type="button"
                  >
                    {showValue ? <IconVisibilityOff /> : <IconVisibilityOn />}
                  </button>
                </div>
                {invalidNamesInputs.includes(FormData.userBic) && (
                  <BillFormErrorHint message="BIC invalid" />
                )}
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="iban">IBAN</label>
              </td>
              <td>
                <div className="flex">
                  <input
                    type={showValue ? "text" : "password"}
                    className={`${billFormInputStyle} w-full bg-gray-100`}
                    value={user?.iban || ""}
                    onChange={(e) => handleInputChange("iban", e.currentTarget.value)}
                    onFocus={(e) => e.target.select()}
                    placeholder="FR6617569000709181828785C71"
                    id="iban"
                    name={FormData.userIban}
                    pattern={`${REGEX_IBAN}`.replaceAll("/", "")}
                  />
                  <button
                    className="button is-ghost px-2"
                    onClick={toggleShowValue}
                    type="button"
                  >
                    {showValue ? <IconVisibilityOff /> : <IconVisibilityOn />}
                  </button>
                </div>
                {invalidNamesInputs.includes(FormData.userIban) && (
                  <BillFormErrorHint message="Iban invalid" />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      {user?.showPaymentInformation ? (
        <button
          className="button is-ghost bg-w-0/h-full bg-left font-sans"
          type="button"
          onClick={() => {
            setUser({ ...user, showPaymentInformation: false } as User)
          }}
        >
          <IconVisibilityOff />
          Ne pas mettre mon <abbr title="Relevé d'identité bancaire">RIB</abbr>
        </button>
      ) : (
        <button
          className="button is-ghost p-1 font-sans"
          type="button"
          onClick={() => {
            setUser({ ...user, showPaymentInformation: true } as User)
          }}
        >
          <IconVisibilityOn />
          Montrer mon <abbr title="Relevé d'identité bancaire">RIB</abbr>
        </button>
      )}
    </div>
  )
}
