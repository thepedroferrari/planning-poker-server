import "./env"
import { fastify } from "fastify"
import cookie from "fastify-cookie"
import cors from "fastify-cors"
import { authUser } from "./accounts/auth"
import { getUserFromCookies } from "./accounts/getUserFromCookies"
import { logUserIn } from "./accounts/logUserIn"
import { logUserOut } from "./accounts/logUserOut"
import { registerUser } from "./accounts/registerUser"
import { connectDb } from "./db"
import { RegisterUser, UserAuth } from "./types/types"
import { validateRegister } from "./utils/validateRegister"
import { STATUS } from "./constants"

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
    app.post<{ Body: RegisterUser }>(
      "/api/register",
      {},
      async (request, reply) => {
        try {
          const username = request.body?.username
          const email = request.body?.email.toLowerCase()
          const password = request.body?.password

          const errors = validateRegister({ username, email, password })

          if (errors.length > 0) {
            reply.send({
              data: {
                status: STATUS.FAILURE,
                errors,
              },
            })

            return
          }

          const userId = await registerUser({
            username,
            email,
            password,
          })

          if (userId) {
            await logUserIn({ reply, request, userId })
            reply.send({
              data: {
                status: STATUS.SUCCESS,
                userId,
              },
            })
          }
        } catch (e) {
          console.error(e)

          reply.send({
            data: {
              status: STATUS.FAILURE,
            },
          })
        }
        return false
      },
    )

    // Auth User
    app.post<{ Body: UserAuth }>("/api/auth", {}, async (request, reply) => {
      // Check for errors before doing unnecessary database requests
      const email = request.body.email.toLowerCase()
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
            data: {
              status: STATUS.SUCCESS,
              userId,
            },
          })
        }
        reply.send({
          data: {
            status: STATUS.FAILURE,
          },
        })

        return isAuth
      } catch (e) {
        console.error(e)
        reply.send({
          data: {
            status: STATUS.FAILURE,
            errors: e,
          },
        })
      }
      return false
    })

    // Verify login / session
    app.get("/test", {}, async (request, reply) => {
      try {
        // Verify User login
        const user = await getUserFromCookies(request, reply)
        // Return user email if found, otherwise return false

        reply.type("application/json").code(200)
        user?._id
          ? reply.send({
              data: {
                status: STATUS.SUCCESS,
                user,
              },
            })
          : reply.send({
              data: {
                status: STATUS.FAILURE,
              },
            })
      } catch (e) {
        reply.send({
          data: {
            status: STATUS.FAILURE,
            error: e,
          },
        })
        throw new Error(`Error verifying from cookies: ${e}`)
      }
    })

    // Logout
    app.post("/api/logout", {}, async (request, reply) => {
      await logUserOut(request, reply)

      reply.send({
        data: {
          status: STATUS.SUCCESS,
          message: "User Logged out",
        },
      })
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
