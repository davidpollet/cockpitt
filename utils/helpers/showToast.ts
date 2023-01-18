import toast from "react-hot-toast"

const showToast = (message: string, type: "error" | "success" | "") => {
  type ? toast[type](message) : toast(message, { duration: 3000 })
}

export default showToast
