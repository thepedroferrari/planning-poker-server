import { client } from "../db"
import "../env"

export const session = client
  .db(process.env.MONGO_DB_NAME)
  .collection("session")
