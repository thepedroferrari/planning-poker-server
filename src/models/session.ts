import { client } from "../db"
import "../env"

export const session = client
  .db(process.env.MONGO_DB_NAME)
  .collection("session")

// index the session token since we're querying by it
session.createIndex({ sessionToken: 1 })
