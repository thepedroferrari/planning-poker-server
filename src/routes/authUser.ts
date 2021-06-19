import { FastifyReply, FastifyRequest } from "fastify"
import { authUser } from "../accounts/auth"
import { logUserIn } from "../accounts/logUserIn"
import { STATUS } from "../constants"
import { UserAuth } from "../types/types"
import { validateRegister } from "../utils/validateRegister"

export const authUserRoute = async (
  request: FastifyRequest<{ Body: UserAuth }>,
  reply: FastifyReply,
) => {
  // Check for errors before doing unnecessary database requests
  const email = request.body.email.toLowerCase()
  const password = request.body.password
  const hasErrors = await validateRegister(
    {
      username: "default",
      email,
      password,
    },
    "login",
  )
  if (hasErrors.length > 0) return hasErrors

  try {
    const { isAuth, userId } = await authUser({
      email,
      password,
    })

    if (isAuth && userId) {
      await logUserIn({ userId, request, reply })
      reply.send({
        data: {
          status: STATUS.SUCCESS,
          userId,
        },
      })
    }
    reply.send({
      data: {
        status: STATUS.FAILURE,
      },
    })

    return isAuth
  } catch (e) {
    reply.send({
      data: {
        status: STATUS.FAILURE,
        errors: e,
      },
    })

    throw new Error(`Error authenticating user: ${e}`)
  }
}
