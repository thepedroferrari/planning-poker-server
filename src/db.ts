import mongo from "mongodb"
import "./env"

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
    // close connection if issues found
    await client.close()

    throw new Error(`Error connecting to the DB: ${e}`)
  }
}
