import { FastifyReply, FastifyRequest } from "fastify"
import { getUserFromCookies } from "../accounts/getUserFromCookies"
import { RoomParams, User } from "../types/types"
import { STATUS } from "../constants"
import { findRoomByName } from "../utils/findRoomByName"

export const getRoomRoute = async (
  request: FastifyRequest<{ Params: RoomParams }>,
  reply: FastifyReply,
) => {
  try {
    const { name } = request.params
    const roomData = await findRoomByName(name)

    if (roomData === null) {
      reply.send({
        data: {
          status: STATUS.FAILURE,
          error: "Room does not exist.",
        },
      })
    }

    // Verify Ownership
    const user: User | undefined = await getUserFromCookies(request, reply)
    let isOwner = false
    if (user) {
      isOwner = user.email.address === roomData.owner
    }

    reply.send({
      data: {
        status: STATUS.SUCCESS,
        room: { ...roomData, isOwner },
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
