import React, { useEffect, useState } from "react"
import { openAuthModal, setUserData } from "@store/features/userSlice"
import { useDispatch, useSelector } from "react-redux"

import Image from "next/image"
import Loading from "./Loading"
import { RootState } from "@store/store"
import { signOut } from "next-auth/react"

function HeaderAuth(): JSX.Element {
  const user = useSelector((store: RootState) => store.user)

  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return isLoading ? (
    <Loading isVisible={isLoading} />
  ) : user.isLoggedIn ? (
    <UserDropdown user={user} />
  ) : (
    <button
      className="button is-outline flex-col leading-none text-white ring-white hocus:text-violet-500"
      onClick={() => dispatch(openAuthModal())}
    >
      Connexion <br /> <small className="opacity-80">Inscription</small>
    </button>
  )
}

function UserDropdown({ user }: { user: any }): JSX.Element {
  const dispatch = useDispatch()

  function handleSignOut() {
    signOut({ redirect: false })

    dispatch(
      setUserData({
        email: "",
        id: "",
        name: "",
        picture: "",
      })
    )
  }

  const { image } = user.data
  return (
    <div className="h16 relative w-16">
      <Image
        src={`${image ? image : "/75.jpg"}`}
        width="64px"
        height="64px"
        sizes="64px"
        layout="responsive"
        alt="Jean"
        className="rounded-full"
        onClick={handleSignOut}
      />
    </div>
  )
}

export default HeaderAuth
