import { User, UserAuth } from "../types/types"
import argon2 from "argon2"
import { argon2HashOptions } from "./argon2HashOptions"

export const authUser = async ({ email, password }: UserAuth) => {
  const { user } = await import("../models/user.js")
  const userData = (await user.findOne({
    "email.address": email,
  })) as User
  const isAuth = await argon2.verify(
    userData.password,
    password,
    argon2HashOptions,
  )

  return { isAuth, userId: userData._id }
}
