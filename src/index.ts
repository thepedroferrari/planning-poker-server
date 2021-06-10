import { fastify } from "fastify"
import fastifyStatic from "fastify-static"
import path from "path"
import { fileURLToPath } from "url"

// ESM Specific
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = fastify()

async function startServer() {
  try {
    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    })
    app.get("/", {}, (request, reply) => {
      reply.send({
        data: "Hello World",
      })
    })
    await app.listen(3000)
    console.log("🚀 Server Running at port 3000 🚀")
  } catch (e) {
    console.error(e)
  }
}

startServer()
