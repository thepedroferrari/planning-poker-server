import { client } from "../db"
import "../env"

export const user = client.db(process.env.MONGO_DB_NAME).collection("user")

// Index by the Email address since it is the key we use to get the user.
user.createIndex({ "email.address": 1 })
