import { UserAuth } from "../types/types"
import { isValidEmail } from "./isValidEmail"

export const returnErrors = (field: string, message: string) => [
  { field, message },
]

export const validateRegister = (options: UserAuth) => {
  if (!isValidEmail(options.email)) {
    return returnErrors("email", "Invalid Email")
  }
  if (options.password.length < 6) {
    return returnErrors(
      "password",
      "Your password must be at least 6 characters long",
    )
  }
  return null
}
