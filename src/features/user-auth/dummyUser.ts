import { User } from "./User"
import { dummyBills } from "../income-tracker/dummyBills"

export const DUMMY_USER_ID = "dummyUser"

export const dummyUser: User = {
  id: DUMMY_USER_ID,
  email: "",
  name: "",
  accentColor: "#1219d0",
  customers: dummyBills.map((bill) => bill.customer),
  image: "",
  society: {
    adress: "58 rue des Templiers, 59000 Lille",
    baseline: "Studio créatif",
    email: "hey@jonhdoe.co",
    logo: "/img/dummy-user-logo.png",
    name: "John Doe",
    phone: "06.85.65.12.25",
    siren: "123 456 789",
  },
  showPaymentInformation: true,
  bic: "GEEK FRPP XXX",
  iban: "FR7630001007941234567890185",
  lastBillNumber: dummyBills.length,
  taxRate: 0,
}
