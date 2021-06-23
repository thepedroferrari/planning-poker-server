import { returnErrors } from "./returnErrors"

export const validatePassword = (password: string) => {
  const errors = []
  if (password.length < 6) {
    errors.push(returnErrors("password", "Your password must be at least 6 characters long"))
  }

  // Other annoying password stuff like capital letters, numbers, symbos just
  // to trigger the users:

  return errors
}
