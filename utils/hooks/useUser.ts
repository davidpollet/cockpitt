import { RootState } from "@store/store"
import { useSelector } from "react-redux"

function useUser() {
  const user = useSelector((state: RootState) => state.user.data)
  return { user }
}

export default useUser
