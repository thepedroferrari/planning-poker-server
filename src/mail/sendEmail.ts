import { Transporter } from "nodemailer"
import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"

type SendEmailKeys = "from" | "to" | "subject" | "html"
type SendEmailData = Record<SendEmailKeys, string>

export const sendEmail = async (transport: Transporter<SMTPTransport.SentMessageInfo>, { from, to, subject, html }: SendEmailData) => {
  try {
    const info = await transport.sendMail({
      from,
      to,
      subject,
      html,
    })

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
  } catch (e) {
    throw new Error(`Error Sending email ${e}`)
  }
}
