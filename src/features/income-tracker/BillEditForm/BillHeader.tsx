import { BillFormErrorHint, billFormInputStyle } from "."

import { DEFAULT_ACCENT_COLOR } from "src/features/user-auth/defaultUser"
import { FormData } from "./BillFormData"
import { InputAutoWidth } from "src/ui/InputAutoWidth"
import { REGEX_EMAIL } from "src/lib/regex/email"
import { REGEX_PHONE } from "src/lib/regex/phone"
import { REGEX_SIREN } from "src/lib/regex/siren"
import { Society } from "src/features/user-auth/Society"
import { User } from "src/features/user-auth/User"
import { useBillFormContext } from "./billFormContext"

export function BillHeader() {
  type HeaderInputs = keyof Omit<Society, "turnoverCurrent" | "turnoverComing" | "logo">

  const { invalidNamesInputs, setUser, user } = useBillFormContext()

  function handleInputChange(type: HeaderInputs, value: string) {
    setUser({
      ...(user as User),
      society: {
        ...(user?.society as Society),
        [type]: value,
      },
    })
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1 font-sans">
      <div className="flex items-center text-lg">
        <div className="relative">
          <label>
            <span className="sr-only">Nom de votre société</span>
            <InputAutoWidth
              type="text"
              className={`${billFormInputStyle} font-bold text-black`}
              onChange={(e) => handleInputChange("name", e.currentTarget.value)}
              value={user?.society?.name}
              placeholder={"John Doe"}
              name={FormData.societyName}
              required
            />
            {invalidNamesInputs.includes(FormData.societyName) && (
              <BillFormErrorHint message="Nom commercial obligatoire" />
            )}
          </label>
        </div>

        <hr
          aria-hidden
          className="mx-2 inline-block h-4 w-[1px] bg-gray-300 align-middle"
        />
        <label>
          <span className="sr-only">Slogan ou activité</span>
          <InputAutoWidth
            style={{ color: user?.accentColor || DEFAULT_ACCENT_COLOR }}
            className={billFormInputStyle + "flex-shrink-0"}
            onChange={(e) => handleInputChange("baseline", e.currentTarget.value)}
            value={user?.society?.baseline}
            placeholder={"Photographe de portrait"}
            name={FormData.societyBaseline}
          />
        </label>
      </div>
      <p className="flex gap-1">
        <label>
          <span className="sr-only">Téléphone</span>
          <InputAutoWidth
            inputMode="numeric"
            className={billFormInputStyle}
            placeholder="06.12.34.56.78"
            value={user?.society?.phone}
            onChange={(e) => handleInputChange("phone", e.currentTarget.value)}
            name={FormData.societyPhone}
            pattern={`${REGEX_PHONE}`.replaceAll("/", "")}
          />
          {invalidNamesInputs.includes(FormData.societyPhone) && (
            <BillFormErrorHint message="Le téléphone est incorrect" />
          )}
        </label>
        -
        <label>
          <span className="sr-only">Email</span>
          <InputAutoWidth
            type="email"
            className={billFormInputStyle}
            placeholder="hey@johndoe.me"
            value={user?.society?.email}
            onChange={(e) => handleInputChange("email", e.currentTarget.value)}
            name={FormData.societyEmail}
            pattern={`${REGEX_EMAIL}`.replaceAll("/", "")}
          />
          {invalidNamesInputs.includes(FormData.societyEmail) && (
            <BillFormErrorHint message="L'email est incorrect" />
          )}
        </label>
      </p>
      <label>
        <span className="sr-only">Adresse</span>
        <InputAutoWidth
          className={billFormInputStyle}
          placeholder="144 rue des templiers, 59000 Lille"
          value={user?.society?.adress}
          onChange={(e) => handleInputChange("adress", e.currentTarget.value)}
          name={FormData.societyAdress}
          required
        />
        {invalidNamesInputs.includes(FormData.societyAdress) && (
          <BillFormErrorHint message="L'adresse est requise" />
        )}
      </label>

      <label className={billFormInputStyle}>
        SIREN :
        <InputAutoWidth
          className={billFormInputStyle}
          placeholder="123 456 789"
          value={user?.society?.siren}
          onChange={(e) => handleInputChange("siren", e.currentTarget.value)}
          name={FormData.societySiren}
          pattern={`${REGEX_SIREN}`.replaceAll("/", "")}
          required
        />
        {invalidNamesInputs.includes(FormData.societySiren) && (
          <BillFormErrorHint message="Le SIREN est requis et doit être de 9 chiffres" />
        )}
      </label>
    </div>
  )
}
