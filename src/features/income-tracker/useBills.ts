import { LOCAL_USER_ID, getLocalStorageData } from "src/lib/utils/localStorage"

import { Bill } from "./Bill"
import React from "react"
import { billsApi } from "src/lib/utils/FetchWrapper"
import { showToast } from "src/lib/utils/showToast"
import { useBillStore } from "./useBillStore"
import useSWR from "swr"
import { useUser } from "../user-auth/useUser"

let localBillsSyncedToDB = false
export function useBills() {
  const [isUpdating, setIsUpdating] = React.useState(false)
  const { user } = useUser()

  const shouldFetch = Boolean(user?.email)
  const {
    data: fetchedBills,
    isLoading: swrLoading,
    mutate,
  } = useSWR<Bill[]>(shouldFetch ? `/api/bills/${user?.id}` : null)

  const [isLoading, setIsLoading] = React.useState(swrLoading)
  const [isMerging, setIsMerging] = React.useState(false)

  React.useEffect(() => {
    if (!isMerging) setIsLoading(swrLoading)
  }, [swrLoading, isMerging])

  const {
    localBills,
    remoteBills,
    dummyBills,
    setBills,
    addDummyBills,
    removeDummyBills,
  } = useBillStore()

  // LocalStorage -> Local state
  React.useEffect(() => {
    const shouldSyncLocalStorage =
      typeof window !== "undefined" && localBills.length === 0
    if (shouldSyncLocalStorage) {
      const billsLocalStorage = getLocalStorageData("localBills")
      if (Array.isArray(billsLocalStorage) && billsLocalStorage.length > 0) {
        setBills("localBills", billsLocalStorage)
      }
    }
  }, [setBills, localBills])

  const addNewBill = React.useCallback(
    function addNewBill(newBill: Bill) {
      setIsUpdating(true)
      if (newBill?.ownerId === LOCAL_USER_ID) {
        setBills("localBills", [newBill, ...localBills])
        setIsUpdating(false)
        return
      }

      const updatedRemoteBills = [newBill, ...remoteBills]
      async function addRemoteBill(newBill: Bill) {
        try {
          const response = await billsApi.post(newBill)
          if (response.ok) {
            return updatedRemoteBills
          } else {
            showToast("Impossible d'ajouter la facture. Réessayez", "error")
            return remoteBills
          }
        } catch {
          showToast("Impossible d'ajouter la facture. Réessayez", "error")
          return remoteBills
        } finally {
          setIsUpdating(false)
        }
      }
      mutate(addRemoteBill(newBill), {
        optimisticData: updatedRemoteBills,
        revalidate: true,
      })
    },
    [localBills, mutate, remoteBills, setBills],
  )

  // LocalStorage -> DB
  React.useEffect(() => {
    if (localBillsSyncedToDB) return

    const userSignedWithLocalBills =
      localBills.length > 0 && fetchedBills?.length === 0

    if (!userSignedWithLocalBills) return

    localBillsSyncedToDB = true
    setIsMerging(true)
    setIsLoading(true)
    showToast("Syncronisation des factures ajoutées hors connexion", "info")
    for (const localBill of localBills) {
      addNewBill({ ...localBill, ownerId: user.id })
    }
    setBills("localBills", [])
    setIsLoading(false)
    setIsMerging(false)
  }, [addNewBill, setBills, localBills, user?.id, remoteBills, fetchedBills])

  // Data fetched -> Local state
  React.useEffect(() => {
    const asFetchedBillsToSync =
      Array.isArray(fetchedBills) && fetchedBills.length > 0
    if (asFetchedBillsToSync) {
      setBills("remoteBills", fetchedBills)
    }
  }, [fetchedBills, setBills, isMerging])

  const bills = remoteBills.concat(dummyBills, localBills)
  return {
    bills,
    addDummyBills,
    removeDummyBills,
    isLoading,
    mutate,
    addNewBill,
    isUpdating,
  }
}
