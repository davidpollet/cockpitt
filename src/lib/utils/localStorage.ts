import { Bill } from "src/features/income-tracker/Bill"
import { Project } from "src/features/task-tracker/Project"
import { User } from "src/features/user-auth/User"

export const LOCALSTORAGE_PROJECTS_KEY = "localProjects"
export const LOCALSTORAGE_BILL_KEY = "localBills"
export const LOCAL_USER_ID = "localUser"

const LocalStorageKeys = [
  LOCAL_USER_ID,
  LOCALSTORAGE_BILL_KEY,
  LOCALSTORAGE_PROJECTS_KEY,
] as const

type LocalStorageKey = typeof LocalStorageKeys[number]

type LocalStorageData<T extends LocalStorageKey> =
  T extends typeof LOCALSTORAGE_BILL_KEY
    ? Bill[]
    : T extends typeof LOCAL_USER_ID
    ? User
    : T extends typeof LOCALSTORAGE_PROJECTS_KEY
    ? Project[]
    : never

export function getLocalStorageData<T extends LocalStorageKey>(
  key: T,
): LocalStorageData<T> | undefined {
  if (typeof window === "undefined") return undefined
  const json = localStorage.getItem(key)
  if (json) {
    return JSON.parse(json)
  }
  return undefined
}

export function setLocalStorageData<T extends LocalStorageKey>(
  key: T,
  data: LocalStorageData<T>,
) {
  if (typeof window === "undefined") return
  const jsonData = JSON.stringify(data)
  localStorage.setItem(key, jsonData)
}
