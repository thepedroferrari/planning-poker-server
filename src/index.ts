import "./env"
import { fastify } from "fastify"
import cookie from "fastify-cookie"
import cors from "fastify-cors"
import websocket from "fastify-websocket"
import { connectDb } from "./db"
import { mailInit } from "./mail/mailInit"
import { cookieSettings } from "./config/cookieSettings"
import { corsSettigs } from "./config/corsSettings"
import { registerUserRoute } from "./routes/registerUser"
import { RegisterUser, UserAuth } from "./types/types"
import { authUserRoute } from "./routes/authUser"
import { testAccountRoute } from "./routes/testAccount"
import { logoutRoute } from "./routes/logout"

const app = fastify()

async function startServer() {
  try {
    const transporter = await mailInit()
    app.register(websocket)
    app.register(cors, corsSettigs)
    app.register(cookie, cookieSettings)

    // Websockets have to be before other routes in order to be able to intercept websocket connections to existing routes and close the connection on non-websocket routes.
    app.get("/messages", { websocket: true }, (connection, request) => {
      // Message must have:
      // room ID
      // user ID
      // Vote
      // ? Message
      connection.socket.on("message", (message: string) => {
        console.log("REQ ", request)
        console.log("REQ BODY: ", request.body)
        console.log("MESSAGE: ", message)
        // message === 'hi from client'
        connection.socket.send(message)
      })
    })

    app.get("/", async () => ({
      readme: "https://github.com/thepedroferrari/planning-poker-server",
    }))

    // Register User
    app.post<{ Body: RegisterUser }>("/register", {}, (request, reply) =>
      registerUserRoute(request, reply, transporter),
    )

    // Auth User
    app.post<{ Body: UserAuth }>("/auth", {}, async (request, reply) =>
      authUserRoute(request, reply),
    )

    // Verify login / session
    app.get("/test", {}, async (request, reply) =>
      testAccountRoute(request, reply),
    )

    // Logout
    app.post("/logout", {}, async (request, reply) =>
      logoutRoute(request, reply),
    )

    app.listen(8000, (err, address) => {
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
