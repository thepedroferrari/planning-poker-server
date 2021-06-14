import { client } from "../db"
import "../env"

export const user = client.db(process.env.MONGO_DB_NAME).collection("user")
