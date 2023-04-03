import toast, { ToastOptions } from "react-hot-toast"

import { IconInfo } from "src/ui/icons/Info"

export function showToast(
  message: string,
  type: "error" | "success" | "info" | "default",
  options: ToastOptions = {},
) {
  switch (type) {
    case "error": {
      return toast.error(message, options)
    }
    case "success": {
      return toast.success(message, options)
    }
    case "info": {
      return toast.success(message, {
        ...options,
        icon: <IconInfo className="h-8 w-8 opacity-80" />,
      })
    }
    case "default":
    default: {
      return toast(message, options)
    }
  }
}
