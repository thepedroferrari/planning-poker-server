import { FastifyCookieOptions } from "fastify-cookie"

export const cookieSettings: FastifyCookieOptions = {
  secret: process.env.COOKIE_SECRET,
}
