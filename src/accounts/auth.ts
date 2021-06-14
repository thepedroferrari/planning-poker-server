import { User, UserAuth } from "../types/types"
import { validateRegister } from "../utils/validateRegister"
import argon2 from "argon2"
import { argon2HashOptions } from "./argon2HashOptions"

export const authUser = async ({ email, password }: UserAuth) => {
  // Check for errors before doing unnecessary database requests
  const hasErrors = validateRegister({ username: "default", email, password })
  if (hasErrors.length > 0) return hasErrors

  const { user } = await import("../user/user.js")
  const userData = (await user.findOne({
    "email.address": email,
  })) as User
  const checkUser = await argon2.verify(
    userData.password,
    password,
    argon2HashOptions,
  )

  return checkUser
}
