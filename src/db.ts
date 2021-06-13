import mongo from "mongodb"
import "./env.js"

const { MongoClient } = mongo

const url = process.env.MONGO_URL

export const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

export async function connectDb() {
  try {
    await client.connect()

    // Confirm connection
    await client.db("admin").command({ ping: 1 })
    console.log("✅ Connected to MongoDB")
  } catch (e) {
    console.error(e)
    // close connection if issues found
    await client.close()
  }
}
