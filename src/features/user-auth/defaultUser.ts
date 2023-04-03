import { LOCAL_USER_ID } from "src/lib/utils/localStorage"
import { User } from "./User"

export const DEFAULT_ACCENT_COLOR = "#5412ce"

export const defaultUser: User = {
  id: LOCAL_USER_ID,
  email: "",
  name: "",
  accentColor: DEFAULT_ACCENT_COLOR,
  customers: [],
  image: "",
  society: {
    adress: "",
    baseline: "",
    email: "",
    logo: "",
    name: "",
    phone: "",
    siren: "",
  },
  showPaymentInformation: true,
  bic: "",
  iban: "",
  lastBillNumber: 0,
  taxRate: 0,
}
