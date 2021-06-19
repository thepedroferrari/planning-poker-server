import { FastifyReply, FastifyRequest } from "fastify"
import { createRoom } from "../accounts/createRoom"
import { STATUS } from "../constants"
import { CreateRoom } from "../types/types"
import { findRoomByName } from "../utils/findRoomByName"
import { findUserByEmail } from "../utils/findUserByEmail"
import { returnErrors } from "../utils/returnErrors"

export const createRoomRoute = async (
  request: FastifyRequest<{ Body: CreateRoom }>,
  reply: FastifyReply,
) => {
  const { owner, name } = request.body
  try {
    // Double-check if user is registered
    const userData = await findUserByEmail(owner)
    if (userData.email.address !== owner) {
      reply.send({
        data: {
          status: STATUS.FAILURE,
          error: returnErrors("owner", "Email not registered"),
        },
      })
    }

    // Find if room exists
    const roomData = await findRoomByName(name)
    if (roomData === null) {
      // Create room
      const room = await createRoom({ name, owner })

      reply.send({
        data: {
          status: STATUS.SUCCESS,
          room: room.ops[0],
        },
      })
    }

    reply.send({
      data: {
        status: STATUS.FAILURE,
        error: returnErrors(
          "name",
          "A room with the same name already exists.",
        ),
      },
    })
  } catch (e) {
    reply.send({
      data: {
        status: STATUS.FAILURE,
        error: e,
      },
    })
    throw new Error(`Error creating room: ${e}`)
  }
}
