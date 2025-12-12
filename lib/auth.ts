import { prisma } from './prisma'
import { compare, hash } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface SessionUser {
  id: string
  email: string
  name: string | null
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword)
}

export async function createSession(user: SessionUser): Promise<string> {
  const token = sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
  return token
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const decoded = verify(token, JWT_SECRET) as { userId: string; email: string }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true }
    })
    return user
  } catch (error) {
    return null
  }
}

export async function getUserFromEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      passwordHash: true
    }
  })
}
