import { FastifyReply, FastifyRequest } from "fastify"
import { Transporter } from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import { logUserIn } from "../accounts/logUserIn"
import { registerUser } from "../accounts/registerUser"
import { createVerifyEmailLink } from "../accounts/verify"
import { STATUS } from "../constants"
import { sendEmail } from "../mail/sendEmail"
import { RegisterUser } from "../types/types"
import { validateRegister } from "../utils/validateRegister"

export const registerUserRoute = async (
  request: FastifyRequest<{ Body: RegisterUser }>,
  reply: FastifyReply,
  transporter: Transporter<SMTPTransport.SentMessageInfo>,
) => {
  try {
    const username = request.body?.username
    const email = request.body?.email.toLowerCase()
    const password = request.body?.password

    const errors = await validateRegister({ username, email, password })

    if (errors.length > 0) {
      reply.send({
        data: {
          status: STATUS.FAILURE,
          errors,
        },
      })

      return
    }

    const userId = await registerUser({
      username,
      email,
      password,
    })

    if (userId) {
      const emailLink = await createVerifyEmailLink(email)

      await sendEmail(transporter, {
        from: "pedro@pedroferrari.com",
        to: email,
        subject: `Verify your account at ${process.env.ROOT_DOMAIN}`,
        html: `<h1>Verify your account</h1>
          <p>Hello there, here is the verification link for your account at https://${process.env.ROOT_DOMAIN}/</p>
          <p><a href="${emailLink}" title="verify account">${emailLink}</a></p>
          `,
      })
      await logUserIn({ reply, request, userId })
      reply.send({
        data: {
          status: STATUS.SUCCESS,
          userId,
        },
      })
    }
  } catch (e) {
    console.error(e)

    reply.send({
      data: {
        status: STATUS.FAILURE,
      },
    })
  }
  return false
}
