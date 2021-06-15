import { FastifyReply } from "fastify"

type SetCookies = {
  reply: FastifyReply
  refreshToken: string
  accessToken: string
}
export const setAuthCookies = ({
  reply,
  refreshToken,
  accessToken,
}: SetCookies) => {
  const now = new Date()
  const refreshExpires = new Date(now.setDate(now.getDate() + 30))

  // Send cookies back to Frontend
  reply
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
      expires: refreshExpires,
    })
    .setCookie("accessToken", accessToken, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
    })
}
