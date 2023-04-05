import { BillFormErrorHint, billFormInputStyle } from "."

import { DEFAULT_ACCENT_COLOR } from "src/features/user-auth/defaultUser"
import { FormData } from "./BillFormData"
import { HexColorPicker } from "react-colorful"
import { Popover } from "@headlessui/react"
import { REGEX_COLOR_HEX } from "src/lib/regex/color"
import { User } from "src/features/user-auth/User"
import { useBillFormContext } from "./billFormContext"

export function ColorAccentSetter() {
  const { invalidNamesInputs, user, setUser } = useBillFormContext()
  const isValidColor = (c: string) => REGEX_COLOR_HEX.test(c)

  return (
    <div className="relative flex items-center justify-center pb-4">
      <Popover className="relative">
        <Popover.Button
          className={
            "block h-8 w-8 rounded-l border-none outline-none ring-2 ring-inset ring-black/10"
          }
          style={{ backgroundColor: user?.accentColor || DEFAULT_ACCENT_COLOR }}
          aria-label="Définir votre couleur d'accent"
        />
        <Popover.Panel className="absolute z-10">
          <HexColorPicker
            color={user?.accentColor || DEFAULT_ACCENT_COLOR}
            onChange={(accentColor) =>
              isValidColor(accentColor) && setUser({ ...(user as User), accentColor })
            }
          />
        </Popover.Panel>
      </Popover>

      <label>
        <span className="sr-only">Couleur principal de votre entreprise</span>
        <input
          type="text"
          className={`${billFormInputStyle} h-8 w-[9ch] rounded-l-none bg-none py-0`}
          placeholder="#bada55"
          onChange={({ currentTarget: { value: accentColor } }) =>
            isValidColor(accentColor) && setUser({ ...(user as User), accentColor })
          }
          value={user?.accentColor || DEFAULT_ACCENT_COLOR}
          name={FormData.userAccentColor}
          pattern={`${REGEX_COLOR_HEX}`.replaceAll("/", "")}
        />
        {invalidNamesInputs.includes(FormData.userAccentColor) && (
          <BillFormErrorHint message="La couleur n'est pas au format hexadecimal" />
        )}
      </label>
    </div>
  )
}
