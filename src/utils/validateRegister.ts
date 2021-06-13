import { RegisterUser } from "../types/types"
import { validateEmail } from "./validateEmail.js"

export const returnErrors = (field: string, message: string) => [
  { field, message },
]

export const validateRegister = (options: RegisterUser) => {
  if (!validateEmail(options.email)) {
    return returnErrors("email", "Invalid Email")
  }
  if (options.username.length < 3)
    return returnErrors(
      "username",
      "Your username must be at least 3 characters long",
    )

  if (options.username.includes("@"))
    return returnErrors(
      "username",
      'The username must not contain the character "@"',
    )

  if (options.password.length < 6) {
    return returnErrors(
      "password",
      "Your password must be at least 6 characters long",
    )
  }
  return null
}
