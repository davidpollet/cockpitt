import Image from "next/image"
import { useUser } from "src/features/user-auth/useUser"

function UserAvatar() {
  const { user } = useUser()
  const image = user?.image || ""

  return (
    <div className="relative h-16 w-16 overflow-hidden rounded-full text-white">
      {image ? (
        <Image
          src={image}
          width={64}
          height={64}
          sizes="64px"
          alt={user?.name || ""}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-white text-2xl font-bold text-violet-500">
          {user?.name ? user?.name[0] : "C"}
        </div>
      )}
    </div>
  )
}

export default UserAvatar