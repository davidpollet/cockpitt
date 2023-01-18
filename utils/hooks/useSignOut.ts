import { signOut } from "next-auth/react"
import toast from "react-hot-toast"

function useSignOut() {
  const notify = (message: string) => toast.error(message)
  return async () => {
    await signOut({ redirect: true }).catch(() =>
      notify("Erreur lors de la déconnexion, réessayez s'il vous plait 🙏.")
    )
  }
}

export default useSignOut
