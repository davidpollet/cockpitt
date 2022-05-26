import { nanoid } from "nanoid"
import { userProps } from "@localTypes/userProps"

function createUser({
  email,
  nameFromAuthProvider,
  avatar,
}: {
  email: string
  nameFromAuthProvider: string
  id: string
  avatar: string
}): userProps {
  return {
    createdAt: new Date().getTime(),
    email,
    id: nanoid(),
    memberShip: false,
    memberShipEndAt: null,
    avatar: avatar,
    nameFromAuthProvider,
    username: "",
  }
}

export default createUser
