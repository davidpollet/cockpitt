import { createSlice } from "@reduxjs/toolkit"
import { userProps } from "utils/types/userProps"

const initialState = {
  data: {} as userProps,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.data = { ...state.data, ...action.payload }
    },
    clearUserData: (state) => {
      state.data = { ...initialState.data }
    },
  },
})

export const { setUserData, clearUserData } = userSlice.actions

export default userSlice.reducer
