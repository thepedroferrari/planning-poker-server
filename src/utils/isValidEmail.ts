import { EMAIL_REGEX } from "../constants.js"

export const isValidEmail = (email: string) => EMAIL_REGEX.test(email)
