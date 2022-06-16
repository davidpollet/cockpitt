import {
  addNewBill as storeAddNewBill,
  deleteBill as storeDeleteBill,
  updateBill as storeUpdateBill,
} from "@store/features/incomeSlice"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"

import FetchWrapper from "@helpers/FetchWrapper"
import { RootState } from "@store/store"
import { billProps } from "@localTypes/billProps"
import showToast from "@helpers/showToast"
import useUser from "./useUser"

const billsApi = new FetchWrapper("/api/bills")

function useFetchBills() {
  const { user } = useUser()
  const userLoggedIn = Boolean(user.id)
  let bills: billProps[] = []

  async function getBills() {
    bills = await billsApi.get(`/${user.id}`)
  }

  if (userLoggedIn) getBills()
  return bills
}

function useAddNewBill() {
  const dispatch = useDispatch()
  const [isAdding, setIsAdding] = useState(false)
  const { user } = useUser()

  async function addNewBill(bill: billProps) {
    dispatch(storeAddNewBill(bill))
    if (!bill.owner) return
    setIsAdding(true)
    try {
      await billsApi.post("/", bill)
    } catch {
      showToast("Impossible d'ajouter la facture", "error")
      dispatch(storeDeleteBill(bill))
    } finally {
      setIsAdding(false)
    }
  }

  return { submitNewBill: addNewBill, user, isAdding }
}

function useUpdateBill() {
  const dispatch = useDispatch()
  const bills = useSelector((state: RootState) => state.income.bills)
  const [isUpdating, setIsUpdating] = useState(false)

  async function updateBill(bill: billProps) {
    const oldBill = bills.find((b) => b.id === bill.id)
    dispatch(storeUpdateBill(bill))

    if (!bill.owner) return

    setIsUpdating(true)
    try {
      await billsApi.patch(`/${bill.id}`, bill)
    } catch {
      showToast("Impossible de modifier la facture", "error")
      dispatch(storeUpdateBill(oldBill))
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    function alertPageRefresh() {
      if (isUpdating) {
        alert(
          "La dernière modication est en cours d'application sur le serveur et pourrait être perdus si vous quittez/ou rafraichissez la page."
        )
      }
    }
    window.addEventListener("beforeunload", alertPageRefresh)

    return () => {
      window.removeEventListener("beforeunload", alertPageRefresh)
    }
  }, [isUpdating])

  return {
    updateBill,
    isUpdating,
  }
}

function useDeleteBill() {
  const dispatch = useDispatch()
  const bills = useSelector((state: RootState) => state.income.bills)
  const [isDeleting, setIsDeleting] = useState(false)

  async function deleteBill(bill: billProps) {
    dispatch(storeDeleteBill(bill))

    if (!bill.owner) return

    setIsDeleting(true)
    const oldBill = bills.find((b) => b.id === bill.id)
    try {
      await billsApi.delete(`/${bill.id}`, bill)
    } catch {
      showToast("Impossible de modifier la facture", "error")
      oldBill && dispatch(storeAddNewBill(oldBill))
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteBill,
    isDeleting,
  }
}

export { useDeleteBill, useAddNewBill, useUpdateBill, useFetchBills }
