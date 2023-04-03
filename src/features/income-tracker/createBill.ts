import { Bill } from "./Bill"
import { User } from "../user-auth/User"
import { nanoid } from "nanoid"

export function createBill(user: User, number: number): Bill {
  return {
    customer: {
      name: "",
      adress: "",
      siren: "",
    },
    description: "",
    ownerId: user.id,
    cashedAt: null,
    createdAt: new Date().getTime(),
    id: nanoid(),
    number,
    isDummy: false,
    remindedAt: [],
    sentAt: null,
    taxRate: user.taxRate,
    services: [
      {
        detail: "",
        id: nanoid(),
        price: 0,
        quantity: 1,
      },
    ],
  }
}
