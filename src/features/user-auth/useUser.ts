import { DUMMY_USER_ID, dummyUser } from "./dummyUser"
import {
  LOCAL_USER_ID,
  getLocalStorageData,
  setLocalStorageData,
} from "src/lib/utils/localStorage"

import React from "react"
import { User } from "./User"
import { create } from "zustand"
import { defaultUser } from "./defaultUser"
import { showToast } from "src/lib/utils/showToast"
import useSWR from "swr"
import { useSession } from "next-auth/react"
import { userApi } from "./../../lib/utils/FetchWrapper"

let localUserSyncedToDB = false

type UserStore = {
  dummyUser: User
  localUser: User | null
  remoteUser: User | null
  setUser: (
    type: "dummyUser" | "localUser" | "remoteUser",
    user: User | null,
  ) => void
}

const useUserStore = create<UserStore>((set) => ({
  dummyUser,
  localUser: null,
  remoteUser: null,
  setUser: (type, user) =>
    set((state) => {
      if (type === "localUser") {
        setLocalStorageData("localUser", user as User)
      }
      return { ...state, [type]: user }
    }),
}))

function useUser() {
  const { data, status } = useSession()
  const { localUser, setUser, dummyUser, remoteUser } = useUserStore()
  const [isUpdating, setIsUpdating] = React.useState(false)
  const shouldFetch = Boolean(data?.user?.email)
  const {
    data: fetchedUser = null,
    isLoading: swrLoading,
    mutate,
  } = useSWR<User | null>(shouldFetch ? `/api/user/${data?.user?.email}` : null)

  const [isLoading, setIsLoading] = React.useState(swrLoading)
  const [isMerging, setIsMerging] = React.useState(false)

  const updateUser = React.useCallback(
    function updateUser(updatedUser: User) {
      setIsUpdating(true)
      if (updatedUser?.id === DUMMY_USER_ID) {
        setUser("dummyUser", updatedUser)
        setIsUpdating(false)
        return
      }
      if (updatedUser?.id === LOCAL_USER_ID) {
        setUser("localUser", updatedUser)
        setIsUpdating(false)
        return
      }

      async function updateRemoteUser(updatedUser: User) {
        try {
          const res = await userApi.put(updatedUser)
          if (res.ok) return updatedUser
          else {
            showToast("Échec de la mise à jour de votre profil", "error")
            return remoteUser
          }
        } catch {
          return remoteUser
        } finally {
          setIsUpdating(false)
        }
      }

      mutate(updateRemoteUser(updatedUser), {
        optimisticData: updatedUser,
      })
    },
    [mutate, remoteUser, setUser],
  )

  React.useEffect(() => {
    if (!isMerging) setIsLoading(swrLoading)
  }, [swrLoading, isMerging])

  // LocalStorage -> Local state
  React.useEffect(() => {
    const shouldSyncLocalStorage =
      typeof window !== "undefined" && localUser === null
    if (shouldSyncLocalStorage) {
      const userLocalStorage = getLocalStorageData("localUser")
      setUser("localUser", userLocalStorage || null)
    }
  }, [localUser, setUser])

  // LocalStorage -> DB
  React.useEffect(() => {
    if (localUserSyncedToDB) return
    const jsonUser = getLocalStorageData("localUser")

    if (jsonUser && fetchedUser) {
      localUserSyncedToDB = true
      setIsMerging(true)
      setIsLoading(true)
      showToast(
        "Syncronisation de vos données utilisateurs ajoutées hors connexion",
        "info",
      )

      const mergedUser: User = {
        ...fetchedUser,
        ...jsonUser,
        id: fetchedUser.id,
        email: fetchedUser.email,
        name: fetchedUser?.name || jsonUser.name,
        image: fetchedUser.image || jsonUser.image,
      }
      updateUser(mergedUser)

      setUser("remoteUser", mergedUser)
      setUser("localUser", null)
      setIsMerging(false)
      setIsLoading(false)
    }
  }, [fetchedUser, updateUser, setUser])

  // Data fetched -> Local state
  React.useEffect(() => {
    if (fetchedUser !== undefined) {
      setUser("remoteUser", fetchedUser)
    }
  }, [fetchedUser, setUser, remoteUser])

  return {
    user: remoteUser || localUser || defaultUser,
    localUser,
    dummyUser,
    status,
    isLoading,
    isUpdating,
    updateUser,
  }
}

export { useUser }
