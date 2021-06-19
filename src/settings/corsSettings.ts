import { FastifyCorsOptions } from "fastify-cors"

export const corsSettigs: FastifyCorsOptions = {
  origin: [
    /\.pedro.dev/,
    "https://pedro.dev",
    /\.pedroferrari.com/,
    "https://pedroferrari.com",
  ],
  credentials: true,
}
