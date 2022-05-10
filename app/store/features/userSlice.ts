import { createSlice } from "@reduxjs/toolkit"
import { userProps } from "utils/types/userProps"

const initialState: userProps = {
  isLoggedIn: false,
  showAuthModal: false,
  data: {
    createdAt: null,
    email: "",
    id: "",
    memberShip: false,
    memberShipEndAt: null,
    picture: "",
    username: "",
  },
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.data = { ...state.data, ...action.payload }
      action.payload.email
        ? (state.isLoggedIn = true)
        : (state.isLoggedIn = false)
    },
    openAuthModal: (state) => {
      state.showAuthModal = true
    },
    closeAuthModal: (state) => {
      state.showAuthModal = false
    },
  },
})

export const { setUserData, openAuthModal, closeAuthModal } = userSlice.actions

export default userSlice.reducer
