import { NextApiRequest, NextApiResponse } from "next"

import CryptoJS from "crypto-js"
import { User } from "src/features/user-auth/User"
import { connectToDatabase } from "src/lib/utils/db"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let client, db
  const { email } = req.query
  const { method } = req

  try {
    client = await connectToDatabase()
    db = client.db()
  } catch (error) {
    return res.status(500).json({
      error,
      message: "Impossible de se connecter à la base de donnée",
    })
  }

  switch (method) {
    case "GET":
      try {
        const userCollection = client.db().collection<User>("users")
        await userCollection.findOne({ email: email }).then((response) => {
          const user = { ...response, id: response?._id.toString() }
          delete user._id
          if (user.iban) user.iban = decryptData(user.iban)
          if (user.bic) user.bic = decryptData(user.bic)
          res.status(200).json(user)
        })
      } catch (error) {
        res.status(500).json({
          error,
          message: "Impossible de récupérer les données",
        })
      }
      break

    case "PUT":
    case "PATCH":
      try {
        const user = req.body
        await db
          .collection("users")
          .updateOne(
            { email: user.email },
            {
              $set: {
                ...user,
                iban: user.iban ? encryptData(user.iban) : "",
                bic: user.bic ? encryptData(user.bic) : "",
              },
            },
          )
          .then(() => {
            res.status(200).json({ message: "Modification sauvegardé !" })
          })
      } catch (error) {
        res.status(500).json({
          error,
          message: "Impossible !!!!!",
        })
      }
      break

    default:
      throw method
  }

  client.close()
}

function encryptData(data: string) {
  const ciphertext = CryptoJS.AES.encrypt(
    data,
    process.env.CRYPTO_KEY as string,
  )
  return ciphertext.toString()
}

function decryptData(ciphertext: string) {
  const bytes = CryptoJS.AES.decrypt(
    ciphertext,
    process.env.CRYPTO_KEY as string,
  )
  return bytes.toString(CryptoJS.enc.Utf8)
}

export default handler
