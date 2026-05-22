import crypto from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from './db'

export const SESSION_COOKIE = 'swapskill_session'

type SessionPayload = {
  userId: number
  email: string
  name: string
}

export type AuthUser = {
  id: number
  name: string
  email: string
  role: string
  teachSkills: string[]
  learnSkills: string[]
}

const sessionSecret = () => process.env.JWT_SECRET || 'skillswap-development-secret'

const sign = (value: string) =>
  crypto.createHmac('sha256', sessionSecret()).update(value).digest('base64url')

export function createSessionToken(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${sign(body)}`
}

export function readSessionToken(token?: string): SessionPayload | null {
  if (!token) return null

  const [body, signature] = token.split('.')
  if (!body || !signature) return null

  const expected = sign(body)
  if (expected.length !== signature.length) return null
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null

  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value
  const session = readSessionToken(token)

  if (!session?.userId) return null

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      teachSkills: true,
      learnSkills: true,
    },
  })
}

export async function requireCurrentUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/signin')
  return user
}

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export function comparePassword(password: string, storedPassword = '') {
  const [salt, storedHash] = storedPassword.split(':')
  if (!salt || !storedHash) return false

  const [, hash] = hashPassword(password, salt).split(':')
  if (hash.length !== storedHash.length) return false
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash))
}
