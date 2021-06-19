import "../env"
import crypto from "crypto"

const { ROOT_DOMAIN, JWT_SECRET } = process.env

const createVerifyEmailToken = async (email: string) => {
  try {
    // create JWT Auth String
    const authString = `${JWT_SECRET}:${email}`
    return crypto.createHash("sha256").update(authString).digest("hex")
  } catch (e) {
    throw new Error(e)
  }
}

export const createVerifyEmailLink = async (email: string) => {
  try {
    // create token to verify user
    const emailToken = await createVerifyEmailToken(email)
    const URIEncodedEmail = encodeURIComponent(email)

    return `https://${ROOT_DOMAIN}/verify/${URIEncodedEmail}/${emailToken}`
  } catch (e) {
    throw new Error(e)
  }
}
