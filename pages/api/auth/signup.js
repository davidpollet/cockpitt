import { EMAIL_REGEX } from '../../../utils/consts/regex-collection'
import { connectToDatabase } from '../../../utils/helpers/db'
import { hashPassword } from '../../../utils/helpers/auth'

async function handler (req, res) {
  if (req.method !== 'POST') return

  const { email, password } = JSON.parse(req.body)

  console.log(email, password)

  const emailIsWrong = !email || !email.includes('@')
  const passwordIsWrong = !password || password.trim().length < 7

  if (passwordIsWrong) {
    res.status(422).json({
      message: 'Invalid input - password should be at least 7 characters long'
    })
    return
  }

  if (emailIsWrong) {
    res.status(422).json({
      message: 'Invalid email'
    })
    return
  }

  const client = await connectToDatabase()
  const db = client.db()
  const hashedPassword = await hashPassword(password)

  const userExists = await db.collection('users').findOne({ email })
  if (userExists) {
    res.status(422).json({
      message: 'User exists already'
    })
    client.close()
    return
  }

  const result = await db.collection('users').insertOne({
    email,
    password: hashedPassword
  })

  res.status(201).json({ message: 'Created user !' })
  client.close()
}

export default handler
