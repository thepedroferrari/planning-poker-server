import { User } from "../types/types.js"

export const findUserByEmail = async (email: string) => {
  const { user } = await import("../models/user.js")
  return (await user.findOne({
    "email.address": email,
  })) as User
}
