import { RegisterUser } from "../types/types"
import { returnErrors } from "./returnErrors"
import { validateEmail } from "./validateEmail"
import { validatePassword } from "./validatePassword"
import { validateUsername } from "./validateUsername"

/**
 * @description Checks for errors in the for and return a set of fields and
 * messages that may contain errors. The error list can be used in the frontend
 * to help users send the form once and know all errors that were made.
 * @param options: RegisterUser {username, email, password}
 * @returns [{field, message}][]
 */
export const validateRegister = (options: RegisterUser) => {
  const errors = []
  if (!validateEmail(options.email)) {
    errors.push(...returnErrors("email", "Invalid Email"))
  }

  const usernameErrors = validateUsername(options.username)
  if (usernameErrors !== null) {
    errors.push(...usernameErrors)
  }

  const passwordErrors = validatePassword(options.password)
  if (passwordErrors !== null) {
    errors.push(...passwordErrors)
  }

  return errors
}
