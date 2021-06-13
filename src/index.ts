import "./env"
import { fastify } from "fastify"
import cors from "fastify-cors"
import { registerUser } from "./accounts/registerUser"
import { connectDb } from "./db"
import { RegisterUser } from "./types/types"

const app = fastify()

async function startServer() {
  try {
    app.register(cors, {
      origin: "*",
      methods: ["POST"],
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
        console.log("UserID: ", userId)
        return userId
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
