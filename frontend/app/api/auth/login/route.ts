import { NextResponse } from 'next/server'
import { comparePassword, createSessionToken, SESSION_COOKIE } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: String(email).toLowerCase() },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      teachSkills: true,
      learnSkills: true,
    },
  })

  if (!user || !comparePassword(String(password), user.password)) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
  }

  const response = NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.role,
      teachSkills: user.teachSkills,
      learnSkills: user.learnSkills,
    },
  })

  response.cookies.set(SESSION_COOKIE, createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
  }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
