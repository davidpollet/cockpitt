import { billProps } from "@localTypes/billProps"
import { createSlice } from "@reduxjs/toolkit"
import dummyBills from "@consts/dummyBills"
import turnoverFiltered from "@helpers/turnoverFiltered"

const initialState = {
  bills: [] as billProps[],
  turnovers: {
    current: 0,
    coming: 0,
  },
}

const incomeSlice = createSlice({
  name: "income",
  initialState,
  reducers: {
    initBills: (state, action) => {
      state.bills = action.payload
    },

    removeDummyBills: (state, action: { payload: billProps[] }) => {
      state.bills = action.payload.filter(({ isDummy }) => !isDummy)
      state.turnovers.current = turnoverFiltered(
        action.payload.filter(({ isDummy }) => !isDummy),
        "CASHED"
      )
      state.turnovers.coming = turnoverFiltered(
        action.payload.filter(({ isDummy }) => !isDummy),
        "NOT CASHED"
      )
    },

    addDummyBills: (state) => {
      state.bills = dummyBills
      state.turnovers.current = turnoverFiltered(dummyBills, "CASHED")
      state.turnovers.coming = turnoverFiltered(dummyBills, "NOT CASHED")
    },

    deleteBill: (state, action) => {
      const billIndex = state.bills.findIndex((f) => f.id === action.payload.id)
      state.bills = state.bills.filter((f, i) => i !== billIndex)
      action.payload.cashedAt
        ? (state.turnovers.current -= action.payload.amount)
        : (state.turnovers.coming -= action.payload.amount)
    },

    updateBill: (state, action) => {
      const billIndex = state.bills.findIndex(
        (bill) => bill.id === action.payload.id
      )
      const billState = state.bills[billIndex]
      const billPayload = action.payload

      const previousAmount = billState.amount
      const payloadAmount = billPayload.amount

      const cashedStateChanged = billState.cashedAt !== billPayload.cashedAt
      state.bills[billIndex] = action.payload

      if (previousAmount !== payloadAmount) {
        billPayload.cashedAt
          ? (state.turnovers.current += payloadAmount - previousAmount)
          : (state.turnovers.coming += payloadAmount - previousAmount)
      }

      if (cashedStateChanged) {
        if (billPayload.cashedAt) {
          state.turnovers.current += payloadAmount
          state.turnovers.coming -= payloadAmount
        } else {
          state.turnovers.current -= payloadAmount
          state.turnovers.coming += payloadAmount
        }
      }
    },

    createBill: (state, action) => {
      state.bills.unshift(action.payload)
      state.turnovers.coming += action.payload.amount
    },
  },
})

export const {
  initBills,
  removeDummyBills,
  addDummyBills,
  deleteBill,
  updateBill,
  createBill,
} = incomeSlice.actions

export default incomeSlice.reducer
