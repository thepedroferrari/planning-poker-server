import { client } from "../db.js"
import "../env.js"

export const user = client.db(process.env.MONGO_DB_NAME).collection("user")
