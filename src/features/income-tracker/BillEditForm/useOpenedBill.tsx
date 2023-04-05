import { useBill } from "../useBill"
import { useFormModalBill } from "../IncomesTracker"

export function useOpenedBill() {
  const { openedBillId } = useFormModalBill()
  const { bill: openedBill } = useBill(openedBillId)
  return { openedBill }
}
