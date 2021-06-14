import argon2 from "argon2"
import { RegisterUser, User } from "../types/types"
import { validateRegister } from "../utils/validateRegister"
import { argon2HashOptions } from "./argon2HashOptions"

export const registerUser = async ({
  username,
  email,
  password,
}: RegisterUser) => {
  const hasErrors = validateRegister({ username, email, password })
  if (hasErrors) return hasErrors

  try {
    // Hash password
    const hashedPassword = await argon2.hash(password, argon2HashOptions)
    // store in DB
    const newUser: User = {
      username,
      email: {
        address: email,
        verified: false,
      },
      password: hashedPassword,
      registrationDate: Date.now(),
    }
    const { user } = await import("../models/user.js")
    const result = await user.insertOne(newUser)

    // Return user from Database
    return result.insertedId
  } catch (e) {
    console.error(e)
  }

  return null
}
