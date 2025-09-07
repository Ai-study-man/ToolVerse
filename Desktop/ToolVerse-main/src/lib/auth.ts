import NextAuth, { DefaultSession } from "next-auth"
import { getServerSession } from "next-auth/next"
import type { NextAuthOptions, User, Account, Session } from "next-auth"
import type { JWT } from "next-auth/jwt"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        image: { label: "Image", type: "text" },
        googleId: { label: "Google ID", type: "text" },
        accessToken: { label: "Access Token", type: "text" },
        isRegister: { label: "Is Register", type: "text" }
      },
      async authorize(credentials) {
        console.log('=== CREDENTIALS AUTH START ===')
        console.log('Credentials:', { 
          email: credentials?.email, 
          password: credentials?.password ? '***hidden***' : 'missing',
          googleId: credentials?.googleId,
          isRegister: credentials?.isRegister
        })
        
        if (!credentials?.email) {
          console.log('Missing email')
          return null
        }

        // Google登录处理
        if (credentials.googleId) {
          console.log('Processing Google authentication')
          
          let user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })

          if (!user) {
            console.log('Creating new Google user')
            user = await prisma.user.create({
              data: {
                email: credentials.email as string,
                name: credentials.name as string,
                image: credentials.image as string,
                googleId: credentials.googleId as string,
              }
            })
          } else {
            console.log('Updating existing user with Google ID')
            user = await prisma.user.update({
              where: { email: credentials.email as string },
              data: {
                googleId: credentials.googleId as string,
                image: credentials.image as string,
                name: credentials.name as string,
              }
            })
          }

          const result = {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
          console.log('Google auth result:', result)
          console.log('=== GOOGLE AUTH SUCCESS ===')
          return result
        }

        // 常规密码登录处理
        if (!credentials?.password) {
          console.log('Missing password for regular login')
          return null
        }

        console.log('Looking for user with email:', credentials.email)
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user) {
          console.log('User not found')
          return null
        }

        if (!user.password) {
          console.log('User has no password (probably OAuth user)')
          return null
        }

        console.log('User found, comparing passwords')
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          console.log('Password invalid')
          return null
        }

        console.log('Password valid, returning user data')
        const result = {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
        console.log('Auth result:', result)
        console.log('=== CREDENTIALS AUTH SUCCESS ===')
        
        return result
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      console.log('=== SIGNIN CALLBACK ===')
      console.log('User:', user)
      console.log('Account:', account)
      
      // 处理 Google OAuth 登录
      if (account?.provider === 'google' && user.email) {
        try {
          // 查找或创建用户
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email }
          })
          
          if (!dbUser) {
            console.log('Creating new user from Google OAuth')
            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || '',
                image: user.image || '',
                googleId: account.providerAccountId,
              }
            })
          } else {
            console.log('Updating existing user with Google info')
            dbUser = await prisma.user.update({
              where: { email: user.email },
              data: {
                name: user.name || dbUser.name,
                image: user.image || dbUser.image,
                googleId: account.providerAccountId,
              }
            })
          }
          
          // 更新 user 对象的 ID 为数据库中的 ID
          user.id = dbUser.id
          
        } catch (error) {
          console.error('Error in signIn callback:', error)
          return false
        }
      }
      
      return true
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log('=== SESSION CALLBACK ===')
      console.log('Session:', session)
      console.log('Token:', token)
      
      // 确保session中有用户ID
      if (token.sub) {
        session.user.id = token.sub as string
      }
      
      return session
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      console.log('=== JWT CALLBACK ===')
      console.log('Token:', token)
      console.log('User:', user)
      
      // 如果是首次登录，user 对象会存在
      if (user) {
        token.sub = user.id
        return token
      }
      
      return token
    }
  },
  events: {
    async signIn(message: any) {
      console.log('=== SIGNIN EVENT ===', message)
    },
    async signOut(message: any) {
      console.log('=== SIGNOUT EVENT ===', message)
    },
    async createUser(message: any) {
      console.log('=== CREATE USER EVENT ===', message)
    },
    async session(message: any) {
      console.log('=== SESSION EVENT ===', message)
    }
  },
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: "/auth/signin",
  },
}

export default NextAuth(authOptions)

// 创建 auth 函数用于服务器端认证检查
export const auth = () => getServerSession(authOptions)
