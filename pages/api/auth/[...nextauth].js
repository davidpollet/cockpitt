import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import NextAuth from 'next-auth'
import { connectToDatabase } from '../../../utils/helpers/db'
import { verifyPassword } from '../../../utils/helpers/auth'

export default NextAuth({
  session: {
    jwt: true
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    CredentialsProvider({
      name: 'Credentials',
      async authorize (credentials) {
        const client = await connectToDatabase()

        const usersCollection = client.db().collection('users')

        const user = await usersCollection.findOne({
          email: credentials.email
        })

        if (!user) {
          client.close()
          throw new Error('No user found!')
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        )

        if (!isValid) {
          client.close()
          throw new Error('Could not log you in!')
        }

        client.close()
        return { email: user.email, id: user._id.toString() }
      }
    })
  ]
})
