import authModalSlice from "./features/authModalSlice"
import { combineReducers } from "redux"
import { configureStore } from "@reduxjs/toolkit"
import incomeReducer from "./features/incomeSlice"
import todosSlice from "./features/todosSlice"
import userSlice from "./features/userSlice"

const reducers = combineReducers({
  income: incomeReducer,
  todos: todosSlice,
  user: userSlice,
  authModal: authModalSlice,
})

const store = configureStore({
  reducer: reducers,
})

export default store

export type RootState = ReturnType<typeof reducers>
