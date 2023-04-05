import { Bill } from "../Bill"
import React from "react"
import { User } from "src/features/user-auth/User"

type FormContextProps = {
  bill: Bill | undefined
  invalidNamesInputs: string[]
  isDownloading: boolean
  isUpdating: boolean
  user: User | undefined
  setBill: React.Dispatch<React.SetStateAction<Bill>>
  setIsDownloading: React.Dispatch<React.SetStateAction<boolean>>
  setInvalidNamesInputs: React.Dispatch<React.SetStateAction<string[]>>
  setUser: React.Dispatch<React.SetStateAction<User>>
}

export const FormContext = React.createContext<FormContextProps | null>(null)

export function useBillFormContext(): FormContextProps {
  const formContext = React.useContext(FormContext)
  if (!formContext) {
    throw new Error("useFormContext has to be used within <FormContext.Provider>")
  }
  return formContext
}
