import { combineReducers } from "redux"
import { configureStore } from "@reduxjs/toolkit"
import incomeReducer from "./features/billsSlice"
import userSlice from "./features/userSlice"

const reducers = combineReducers({
  income: incomeReducer,
  user: userSlice,
})

export const store = configureStore({
  devTools: true,
  reducer: reducers,
})

export type RootState = ReturnType<typeof reducers>
