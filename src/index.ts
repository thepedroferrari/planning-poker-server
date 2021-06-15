import "./env"
import { fastify } from "fastify"
import cors from "fastify-cors"
import cookie from "fastify-cookie"
import { registerUser } from "./accounts/registerUser"
import { connectDb } from "./db"
import { RegisterUser, UserAuth } from "./types/types"
import { authUser } from "./accounts/auth"
import { validateRegister } from "./utils/validateRegister"
import { logUserIn } from "./accounts/logUserIn"

const app = fastify()

async function startServer() {
  try {
    app.register(cors, {
      origin: "*",
      methods: ["POST"],
    })
    app.register(cookie, {
      secret: process.env.COOKIE_SECRET,
    })
    // Declare a route
    app.get("/", async (_, reply) => {
      reply.type("application/json").code(200)
      return { hello: "world" }
    })
    // Register User
    app.post<{ Body: RegisterUser }>("/api/register", {}, async (request) => {
      try {
        const userId = await registerUser({
          username: request.body.username,
          email: request.body.email,
          password: request.body.password,
        })
        return userId
      } catch (e) {
        console.error(e)
      }
      return false
    })

    // Auth User
    app.post<{ Body: UserAuth }>("/api/auth", {}, async (request, reply) => {
      // Check for errors before doing unnecessary database requests
      const email = request.body.email
      const password = request.body.password
      const hasErrors = validateRegister({
        username: "default",
        email,
        password,
      })
      if (hasErrors.length > 0) return hasErrors

      try {
        const { isAuth, userId } = await authUser({
          email,
          password,
        })

        if (isAuth && userId) {
          await logUserIn({ userId, request, reply })
          reply.send({
            data: `User Logged in`,
          })
        }
        reply.send({
          data: `Auth Failed.`,
        })

        return isAuth
      } catch (e) {
        console.error(e)
      }
      return false
    })

    app.listen(3000, (err, address) => {
      if (err) throw err
      console.log(`🚀 Server is now listening on ${address} 🚀`)
    })
  } catch (e) {
    console.error(e)
  }
}

connectDb().then(() => {
  startServer()
})
