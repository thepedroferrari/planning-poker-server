import jwt from "jsonwebtoken"

const JWTSecret = process.env.JWT_SECRET

export const createTokens = async (sessionToken: string, userId: string) => {
  try {
    // Create Refresh Token
    // Session Id
    const refreshToken = jwt.sign(
      {
        sessionToken,
      },
      JWTSecret,
    )
    // Create Access Token
    // Session Id, User Id
    const accessToken = jwt.sign(
      {
        sessionToken,
        userId,
      },
      JWTSecret,
    )
    // Return Refresh Token

    return { accessToken, refreshToken }
  } catch (e) {
    throw new Error(`Couldn't Generate signed JWT's. ${e}`)
  }
}
