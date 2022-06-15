import Image from "next/image"
import { RootState } from "@store/store"
import { useSelector } from "react-redux"

function UserAvatar() {
  const user = useSelector((state: RootState) => state.user.data)

  const image = user?.image || ""
  return (
    <div className="relative h-16 w-16 overflow-hidden rounded-full text-white">
      {image ? (
        <Image
          src={image}
          width="64px"
          height="64px"
          sizes="64px"
          layout="responsive"
          alt={user?.name || ""}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-white text-2xl font-bold text-violet-500">
          {user?.name[0] || "C"}
        </div>
      )}
    </div>
  )
}

export default UserAvatar
