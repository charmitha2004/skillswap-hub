import { NextResponse } from 'next/server'
import { createSessionToken, hashPassword, SESSION_COOKIE } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  const { name, email, password, department = 'General' } = await request.json()

  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Name, email, and password are required' }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: String(email).toLowerCase() },
    select: { id: true },
  })

  if (existingUser) {
    return NextResponse.json({ message: 'An account with this email already exists' }, { status: 409 })
  }

  const user = await prisma.user.create({
    data: {
      name: String(name),
      email: String(email).toLowerCase(),
      password: hashPassword(String(password)),
      role: String(department),
      teachSkills: [],
      learnSkills: [],
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      teachSkills: true,
      learnSkills: true,
    },
  })

  const response = NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.role,
      teachSkills: user.teachSkills,
      learnSkills: user.learnSkills,
    },
  }, { status: 201 })

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
