type userDataProps = {
  email: string
  nameFromAuthProvider: string
  username: string
  id: string
  memberShip: false | "free" | "premium"
  memberShipEndAt: number | null
  createdAt: number | null
  avatar: string
}

export type userProps = userDataProps
