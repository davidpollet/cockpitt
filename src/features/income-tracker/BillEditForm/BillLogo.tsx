/* eslint-disable @next/next/no-img-element */

import { IconClose } from "src/ui/icons/Close"
import { IconImageUpload } from "src/ui/icons/ImageUpload"
import { IconTrashOutline } from "src/ui/icons/Trash"
import React from "react"
import { Society } from "src/features/user-auth/Society"
import Spinner from "src/ui/Spinner"
import { User } from "src/features/user-auth/User"
import { showToast } from "src/lib/utils/showToast"
import { uploadImageAndGetUrl } from "src/lib/utils/uploadImageAndGetUrl"
import { useBillFormContext } from "./billFormContext"

export function BillLogo() {
  const { user } = useBillFormContext()
  return user?.society?.logo ? <Logo /> : <LogoUpload />
}

function Logo() {
  const logoRef = React.useRef<HTMLImageElement>(null)
  const { user, setUser } = useBillFormContext()

  function resetLogo() {
    const logo = logoRef.current as HTMLImageElement
    logo.classList.add("opacity-0", "scale-50")

    setUser({
      ...user,
      society: { ...user?.society, logo: "" } as Society,
    } as User)
  }

  function handleImageLoaded() {
    const logo = logoRef.current as HTMLImageElement
    logo.classList.remove("opacity-0", "scale-50")
  }

  return (
    <div className="mb-2 flex justify-center">
      <div className="relative h-11">
        <img
          src={user?.society.logo as string}
          onLoad={handleImageLoaded}
          alt="logo"
          ref={logoRef}
          height={44}
          className="h-11 w-auto scale-50 opacity-0 transition"
        />
        <button
          className="button is-ghost absolute left-full top-1/2 translate-x-2 -translate-y-1/2 p-2"
          onClick={resetLogo}
          type="button"
        >
          <IconTrashOutline />
        </button>
      </div>
    </div>
  )
}

function LogoUpload() {
  const { setUser, user } = useBillFormContext()
  const [showUploadLimitTip, setShowUploadLimitTip] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  async function handleUpdateLogo(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget
    if (!files?.length) return
    const IMAGE_UPLOAD_LIMIT = 1_000_000 // 1mo en octet
    const newLogo = files[0]

    if (newLogo.size > IMAGE_UPLOAD_LIMIT) {
      showToast("Taille de l'image trop lourde", "error")
      setShowUploadLimitTip(true)
      return
    }

    try {
      setIsLoading(true)
      const logoUrl = await uploadImageAndGetUrl(newLogo)
      const newUser: User = {
        ...user,
        society: { ...user?.society, logo: logoUrl } as Society,
      } as User
      setUser(newUser)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="relative">
      <label
        className={`relative mx-auto mb-2 flex cursor-pointer flex-col items-center justify-center border-2 border-dotted border-gray-200 p-4 font-sans transition-all hover:border-violet-300  hover:text-violet-500 focus:border-violet-300 focus:text-violet-300 ${
          isLoading ? "scale-75 opacity-0" : null
        }`}
      >
        <IconImageUpload className="h-8 w-8" />
        <span className="font-bold uppercase">Votre logo</span>
        <span className="text-sm text-violet-500">
          Taille recommandée : au moins 64 &times; 64px
          <br /> Taille maximum: 1024 ko
        </span>
        <input
          type="file"
          name="logo"
          id="logo"
          className="sr-only"
          onChange={handleUpdateLogo}
          accept="image/*, image/svg+xml"
        />
      </label>
      {isLoading && (
        <Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}
      {showUploadLimitTip && (
        <div className="mx-auto -mt-2 flex w-fit min-w-0 items-center gap-1 bg-violet-50 p-1 text-center font-sans text-sm text-violet-500">
          💡 Redimentionnez votre image sur{" "}
          <a
            href="https://imageresizer.com/"
            target="blank"
            title="aller sur image resizer, ouvre un nouvel onglet"
          >
            imageresizer.com
          </a>
          <button
            className="button is-ghost p-1"
            onClick={() => setShowUploadLimitTip(false)}
            type="button"
          >
            <IconClose />
          </button>
        </div>
      )}
    </div>
  )
}
