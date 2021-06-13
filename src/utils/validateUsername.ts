import { returnErrors } from "./returnErrors"

export const validateUsername = (username: string) => {
  const errors = []
  if (username.length < 3) {
    errors.push(
      returnErrors(
        "username",
        "Your username must be at least 3 characters long",
      ),
    )
  }

  if (username.includes("@")) {
    errors.push(
      returnErrors(
        "username",
        'The username must not contain the character "@"',
      ),
    )
  }

  return errors
}
