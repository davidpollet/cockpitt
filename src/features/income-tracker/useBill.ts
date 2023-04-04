import { Bill } from "./Bill"
import { LOCAL_USER_ID } from "src/lib/utils/localStorage"
import React from "react"
import { billsApi } from "src/lib/utils/FetchWrapper"
import { useBillStore } from "./useBillStore"
import { useBills } from "./useBills"

export function useBill(billId: Bill["id"]) {
  const { bills, mutate } = useBills()
  const bill = bills.find(({ id }) => id === billId)
  const { dummyBills, localBills, remoteBills, setBills } = useBillStore()
  const [isUpdating, setIsUpdating] = React.useState(false)

  function deleteBill() {
    if (!bill) throw new Error("La facture n'exite pas")
    setIsUpdating(true)
    const getBillsWithoutCurrentBill = (bills: Bill[]) =>
      bills.filter(({ id }) => id !== bill.id)

    if (bill?.isDummy) {
      setBills("dummyBills", getBillsWithoutCurrentBill(dummyBills))
      setIsUpdating(false)
      return
    }
    if (bill?.ownerId === LOCAL_USER_ID) {
      setBills("localBills", getBillsWithoutCurrentBill(localBills))
      setIsUpdating(false)
      return
    }

    const billsWithoutCurrentBill = getBillsWithoutCurrentBill(remoteBills)
    async function deleteRemoteBill(bill: Bill) {
      try {
        await billsApi.delete(bill)
        return billsWithoutCurrentBill
      } catch {
        return remoteBills
      } finally {
        setIsUpdating(false)
      }
    }
    mutate(deleteRemoteBill(bill as Bill), {
      optimisticData: billsWithoutCurrentBill,
    })
  }

  function updateBill(updatedBill: Bill) {
    setIsUpdating(true)

    const getUpdatedBills = (bills: Bill[]) =>
      bills.map((b) => (b.id === updatedBill.id ? updatedBill : b))

    if (bill?.isDummy) {
      setBills("dummyBills", getUpdatedBills(dummyBills))
      setIsUpdating(false)
      return
    }

    if (bill?.ownerId === LOCAL_USER_ID) {
      setBills("localBills", getUpdatedBills(localBills))
      setIsUpdating(false)
      return
    }

    const updatedRemoteBills = getUpdatedBills(remoteBills)
    async function updateRemoteBill(bill: Bill) {
      try {
        await billsApi.put(bill)
        return updatedRemoteBills
      } catch {
        return bills?.length
          ? bills.map((b) => (b.id === updatedBill.id ? bill : b))
          : [bill]
      } finally {
        setIsUpdating(false)
      }
    }

    mutate(updateRemoteBill(updatedBill as Bill), {
      optimisticData: updatedRemoteBills,
    })
  }

  return {
    bill,
    deleteBill,
    updateBill,
    isUpdating,
  }
}
