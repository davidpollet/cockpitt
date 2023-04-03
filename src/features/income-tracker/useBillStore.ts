import { Bill } from "./Bill"
import { create } from "zustand"
import { dummyBills } from "./dummyBills"
import { setLocalStorageData } from "src/lib/utils/localStorage"

type BillsStore = {
  addDummyBills: () => void
  removeDummyBills: () => void
  setBills: (
    type: "dummyBills" | "localBills" | "remoteBills",
    payload: Bill[],
  ) => void
  dummyBills: Bill[]
  localBills: Bill[]
  remoteBills: Bill[]
}

export const useBillStore = create<BillsStore>((set) => ({
  addDummyBills: () => set((state) => ({ ...state, dummyBills })),
  removeDummyBills: () => set((state) => ({ ...state, dummyBills: [] })),
  dummyBills: [],
  localBills: [],
  remoteBills: [],
  setBills: (type, payload) =>
    set((state) => {
      if (type === "localBills") {
        setLocalStorageData("localBills", payload)
        return { ...state, localBills: [...payload] }
      }
      return { ...state, [type]: [...payload] }
    }),
}))
