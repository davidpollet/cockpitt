import EmailProvider from "next-auth/providers/email"
import FacebookProvider from "next-auth/providers/facebook"
import GoogleProvider from "next-auth/providers/google"
import { MongoClient } from "mongodb"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import NextAuth from "next-auth"
import { createTransport } from "nodemailer"

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID as string,
      clientSecret: process.env.FACEBOOK_SECRET as string,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST as string,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      async sendVerificationRequest(params) {
        /* your function */
        const { identifier, url, provider } = params
        const { host } = new URL(url)
        const transport = createTransport(provider.server)
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `S'authentifier sur Cockpitt`,
          text: text({ url, host }),
          html: html({ url }),
        })
        const failed = result.rejected.concat(result.pending).filter(Boolean)
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
        }
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: MongoDBAdapter(MongoClient.connect(`${process.env.MONGODB_URI}`)),
  session: {
    strategy: "jwt",
  },
})

function html(params: { url: string }) {
  const { url } = params

  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office">
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style>
    td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
  </style>
  <![endif]-->
  <style>
    .hover-bg-violet-400:hover {
      background-color: hsl(261, 84%, 55%) !important
    }
    .hover-text-violet-350:hover {
      color: hsl(261, 84%, 60%) !important
    }
    @media (max-width: 600px) {
      .sm-w-full {
        width: 100% !important
      }
      .sm-px-6 {
        padding-left: 24px !important;
        padding-right: 24px !important
      }
    }
  </style>
</head>
<body style="-webkit-font-smoothing: antialiased; word-break: break-word; margin: 0; width: 100%; background-color: hsl(0, 0%, 100%); padding: 0">
  <div role="article" aria-roledescription="email" aria-label="Confirm Change of Email" lang="en">
    <table style="width: 100%; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding-top: 24px; padding-bottom: 24px">
          <table class="sm-w-full" style="width: 600px; background-color: hsl(0, 0%, 100%)" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="padding: 8px; text-align: center">
                <img src="https://res.cloudinary.com/davidpollet/image/upload/v1679415722/logo-cockpitt_pyk2ur.png" width="196" alt="Cockpitt">
                <h1 style="font-size: 24px; font-weight: 700; color: hsl(261, 84%, 44%)">S'authentifier sur Cockpitt</h1>
              </td>
            </tr>
            <tr>
              <td>
                <span style="margin-left: auto; margin-right: auto; display: block; height: 1px; width: 48px; background-color: hsl(261, 84%, 44%)"></span>
              </td>
            </tr>
            <tr>
              <td align="center">
                <table class="sm-w-full" style="width: 75%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="sm-px-6">
                      <p style="color: #6b7280; line-height: 1.5; font-size: 16px">Une demande d'authentification à été effectuée avec votre adresse email sur le site <a href="https://cockpitt.vercel.app" class="hover-text-violet-350" style="color: hsl(261, 84%, 44%)">cockpitt.vercel.app</a>. <br>Si vous n'êtes pas à l'origine de cette demande, vous pouvez l'ignorez.</p>
                      <p style="text-align: center">
                        <a href="${url}" class="hover-bg-violet-400" style="text-decoration: none; display: inline-block; border-radius: 4px; background-color: hsl(261, 84%, 44%); padding: 20px 24px;font-size: 16px; font-weight: 600; line-height: 1; color: hsl(0, 0%, 100%)">
                          <!--[if mso]><i style="letter-spacing: 24px; mso-font-width: -100%; mso-text-raise: 26pt;">&nbsp;</i><![endif]-->
                          <span style="mso-text-raise: 16pt;">S'authentifier</span>
                          <!--[if mso]><i style="letter-spacing: 24px; mso-font-width: -100%;">&nbsp;</i><![endif]-->
                        </a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}
