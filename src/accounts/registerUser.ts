import argon2 from "argon2"
import { User } from "../types/types"
import { validateRegister } from "../utils/validateRegister.js"

export const registerUser = async (email: string, password: string) => {
  const hasErrors = validateRegister({ email, password })
  if (hasErrors) return hasErrors

  try {
    // Hash password
    const hashedPassword = await argon2.hash(password, {
      memoryCost: 16384,
      parallelism: 2,
      hashLength: 64,
    })
    // store in DB
    const newUser: User = {
      email: {
        address: email,
        verified: false,
      },
      password: hashedPassword,
    }
    const { user } = await import("../user/user.js")
    const result = await user.insertOne(newUser)

    // Return user from Database
    return result.insertedId
  } catch (e) {
    console.error(e)
  }

  return null
}
