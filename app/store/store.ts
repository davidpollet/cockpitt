import authModalSlice from "./features/authModalSlice"
import { combineReducers } from "redux"
import { configureStore } from "@reduxjs/toolkit"
import incomeReducer from "./features/incomeSlice"
import userSlice from "./features/userSlice"

const reducers = combineReducers({
  income: incomeReducer,
  user: userSlice,
  authModal: authModalSlice,
})

export default function getStore(incomingPreloadState?: RootState) {
  const store = configureStore({
    reducer: reducers,
    preloadedState: incomingPreloadState,
  })
  return store
}

export type RootState = ReturnType<typeof reducers>
