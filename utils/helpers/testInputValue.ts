import { EMAIL_REGEX } from "@consts/regex-collection"
import { passwordRequiments } from "utils/types/passwordRequirements"

export function testEmailInput(email: string): {
  isValid: boolean
  errorMessage: string
} {
  if (!email) {
    return {
      errorMessage: "Vous n'avez pas indiqué votre email",
      isValid: false,
    }
  }

  if (!EMAIL_REGEX.test(email)) {
    return {
      errorMessage: "Votre email n'est pas correct",
      isValid: false,
    }
  }

  return {
    errorMessage: "",
    isValid: true,
  }
}

export function testPasswordInput(password: string): passwordRequiments {
  const requirements: passwordRequiments = {
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    isLengthEnough: false,
  }

  requirements.hasLowercase = /[a-z]/.test(password)
  requirements.hasUppercase = /[A-Z]/.test(password)
  requirements.hasNumber = /\d/.test(password)
  requirements.isLengthEnough = password.length >= 8
  return requirements
}
