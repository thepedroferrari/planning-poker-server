import "./env"
import { fastify } from "fastify"
import cookie from "fastify-cookie"
import cors from "fastify-cors"
import websocket from "fastify-websocket"
import { connectDb } from "./db"
import { mailInit } from "./mail/mailInit"
import { cookieSettings } from "./settings/cookieSettings"
import { corsSettigs } from "./settings/corsSettings"
import { registerUserRoute } from "./routes/registerUser"
import { CreateRoom, RegisterUser, RoomParams, UserAuth } from "./types/types"
import { authUserRoute } from "./routes/authUser"
import { testAccountRoute } from "./routes/testAccount"
import { logoutRoute } from "./routes/logout"
import { createRoomRoute } from "./routes/createRoomRoute"
import { getRoomRoute } from "./routes/getRoomRoute"

const app = fastify()

async function startServer() {
  try {
    const transporter = await mailInit()
    app
      .register(websocket)
      .register(cors, corsSettigs)
      .register(cookie, cookieSettings)

      // Websockets have to be before other routes in order to be able to intercept websocket connections to existing routes and close the connection on non-websocket routes.
      .get("/messages", { websocket: true }, (connection, request) => {
        // Message must have:
        // room ID
        // user ID
        // Vote
        // ? Message

        // update array of messages with new messages that arrive
        // save on the database
        // new users first request from the database to get history
        // then they subscribe to new messages
        connection.socket.on("message", (message: string) => {
          console.log("REQ ", request)
          console.log("REQ BODY: ", request.body)
          console.log("MESSAGE: ", message)
          // message === 'hi from client'
          connection.socket.send(message)
        })
      })

      .get("/", async () => ({
        readme: "https://github.com/thepedroferrari/planning-poker-server",
      }))

      // Register User
      .post<{ Body: RegisterUser }>("/register", {}, async (request, reply) =>
        registerUserRoute(request, reply, transporter),
      )

      // Auth User
      .post<{ Body: UserAuth }>("/auth", {}, async (request, reply) =>
        authUserRoute(request, reply),
      )

      .post<{ Body: CreateRoom }>("/create", {}, async (request, reply) =>
        createRoomRoute(request, reply),
      )

      // catch all room
      .get("/room", {}, async (_, reply) => reply.send("Room must have a name"))

      // get a room
      .get<{ Params: RoomParams }>("/room/:name", {}, async (request, reply) =>
        getRoomRoute(request, reply),
      )

      // Verify login / session
      .get("/test", {}, async (request, reply) =>
        testAccountRoute(request, reply),
      )

      // Logout
      .post("/logout", {}, async (request, reply) =>
        logoutRoute(request, reply),
      )

      .listen(8000, (err, address) => {
        if (err) throw err
        console.log(`🚀 Server is now listening on ${address} 🚀`)
      })
  } catch (e) {
    throw new Error(`Error launching the server: ${e}`)
  }
}

connectDb().then(() => {
  startServer()
})
