import { fastify } from "fastify"
import "./env"
import cookie from "fastify-cookie"
import cors from "fastify-cors"
import websocket from "fastify-websocket"
import { connectDb } from "./db"
import { mailInit } from "./mail/mailInit"
import { authUserRoute } from "./routes/authUser"
import { createRoomRoute } from "./routes/createRoomRoute"
import { getRoomRoute } from "./routes/getRoomRoute"
import { logoutRoute } from "./routes/logout"
import { registerUserRoute } from "./routes/registerUser"
import { testAccountRoute } from "./routes/testAccount"
import { updateMessageRoute } from "./routes/updateMessageRoute"
import { cookieSettings } from "./settings/cookieSettings"
import { corsSettigs } from "./settings/corsSettings"
import { CreateRoom, RegisterUser, RoomParams, UserAuth } from "./types/types"

const app = fastify()

async function startServer() {
  try {
    const transporter = await mailInit()
    app
      .register(websocket, {
        options: { maxPayload: 1048576, cors: corsSettigs, cookieSettings },
      })
      .register(cors, corsSettigs)
      .register(cookie, cookieSettings)

    // Websockets have to be before other routes in order to be able to intercept websocket connections to existing routes and close the connection on non-websocket routes.
    app.route<{ Params: RoomParams }>({
      method: "GET",
      url: "/room/:name",
      handler: (request, reply) => {
        getRoomRoute(request, reply)
      },
      wsHandler: (conn, req) => {
        conn.setEncoding("utf8")
        conn.write("hello client")
        const roomName = (req.params as RoomParams).name

        updateMessageRoute(conn, roomName)
      },
    })

    app.get("/sendMessage", { websocket: true }, (connection) => {
      connection.socket.on("message", (message: string) => {
        connection.socket.send(`hi: ${message}`)
      })
      // updateMessageRoute(connection, "Frontend")
    })

    app.get("/", async () => ({
      readme: "https://github.com/thepedroferrari/planning-poker-server",
    }))

    // Register User
    app.post<{ Body: RegisterUser }>("/register", {}, async (request, reply) => registerUserRoute(request, reply, transporter))

    // Auth User
    app.post<{ Body: UserAuth }>("/auth", {}, async (request, reply) => authUserRoute(request, reply))

    app.post<{ Body: CreateRoom }>("/create", {}, async (request, reply) => createRoomRoute(request, reply))

    // catch all room
    app.get("/room", {}, async (_, reply) => reply.send("Room must have a name"))

    // Verify login / session
    app.get("/test", {}, async (request, reply) => testAccountRoute(request, reply))

    // Logout
    app.post("/logout", {}, async (request, reply) => logoutRoute(request, reply))

    app.ready((err) => {
      if (err) throw err
      // app.websocketServer.on("connection", (socket: any) => {
      //   console.log("Client connected.")

      //   socket.on("message", (msg: any) => socket.send(msg)) // Creates an echo server
      //   socket.on("close", () => console.log("Client disconnected."))
      // })
      // const { clients } = app.websocketServer
      // Array.from(clients).forEach((client: any) => {
      //   if (client?.readyState === 1) {
      //     client.send("message")
      //   }
      // })

      // app.websocketServer.clients.forEach(function each(client: any) {
      //   if (client.readyState === 1) {
      //     client.send("message")
      //   }
      // })
    })

    app.listen(8000, (err, address) => {
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
