import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  showAuthModal: false,
}

const authModalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    openAuthModal: (state) => {
      state.showAuthModal = true
    },
    closeAuthModal: (state) => {
      state.showAuthModal = false
    },
  },
})

export const { openAuthModal, closeAuthModal } = authModalSlice.actions

export default authModalSlice.reducer
