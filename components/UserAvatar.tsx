import Image from "next/image"
import { RootState } from "@store/store"
import { useSelector } from "react-redux"

function UserAvatar() {
  const user = useSelector((store: RootState) => store.user.data)

  const { avatar } = user
  return (
    <div className="relative h-16 w-16 overflow-hidden rounded-full text-white">
      {avatar ? (
        <Image
          src={avatar}
          width="64px"
          height="64px"
          sizes="64px"
          layout="responsive"
          alt={user.username}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-white text-2xl font-bold text-violet-500">
          {user.username[0]}
        </div>
      )}
    </div>
  )
}

export default UserAvatar
