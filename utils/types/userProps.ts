type userDataProps = {
  email: string
  username: string
  id: string
  memberShip: false | "free" | "premium"
  memberShipEndAt: number | null
  createdAt: number | null
  picture: string
}

export type userProps = {
  isLoggedIn: boolean
  data: userDataProps
  showAuthModal: boolean
}
