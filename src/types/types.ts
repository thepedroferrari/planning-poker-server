import { FastifyReply, FastifyRequest } from "fastify"

export type User = {
  username: string
  email: {
    address: string
    verified: boolean
  }
  password: string
  registrationDate: number
  _id?: string
}

export type UserAuth = {
  email: string
  password: string
}

export type RegisterUser = UserAuth & {
  username: string
}

export type LogUserIn = {
  userId: string
  request: FastifyRequest
  reply: FastifyReply
}

export type ConnectionInfo = {
  ip: string
  userAgent?: string
}
