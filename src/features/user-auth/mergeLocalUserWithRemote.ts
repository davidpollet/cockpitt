import { User } from "src/features/user-auth/User"
export function mergeLocalUserWithRemote(localUser: User, remoteUser: User) {
  const mergedUser = { ...localUser }
  let k: keyof User
  for (k in localUser) {
    switch (k) {
      case "customers": {
        mergedUser.customers = localUser.customers.concat(remoteUser.customers)
        break
      }
      case "society": {
        let prop: keyof User["society"]
        for (prop in localUser.society) {
          mergedUser.society[prop] = localUser.society[prop]
            ? localUser.society[prop]
            : remoteUser.society[prop]
        }
        break
      }
      case "lastBillNumber": {
        mergedUser[k] = localUser[k] ? localUser[k] : remoteUser[k]
        break
      }
      case "showPaymentInformation": {
        mergedUser[k] = localUser[k] ? localUser[k] : remoteUser[k]
        break
      }
      case "taxRate": {
        mergedUser[k] = localUser[k] ? localUser[k] : remoteUser[k]
        break
      }
      default: {
        mergedUser[k] = localUser[k] ? localUser[k] : remoteUser[k]
      }
    }
  }
  return mergedUser
}
