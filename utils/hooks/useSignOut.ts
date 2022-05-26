import { clearBills } from "@store/features/incomeSlice"
import { clearUserData } from "@store/features/userSlice"
import { signOut } from "next-auth/react"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"

function useSignOut() {
  const dispatch = useDispatch()
  const notify = (message: string) => toast.error(message)

  return () => {
    signOut({ redirect: false })
      .then(() => {
        dispatch(clearUserData())
        dispatch(clearBills())
      })
      .catch(() =>
        notify("Erreur lors de la déconnexion, réessayez s'il vous plait 🙏.")
      )
  }
}

export default useSignOut
