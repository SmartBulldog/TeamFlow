import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters').refine((password) => {
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) return false
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) return false
    // Check for at least one number
    if (!/[0-9]/.test(password)) return false
    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false
    return true
  }, 'Password must contain uppercase, lowercase, number, and special character'),  name: z.string().min(2).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = registerSchema.parse(body)
    
    // Additional password security checks
    const commonWeakPasswords = [
      'password', 'password123', '12345678', 'qwerty123', 'admin123',
      'welcome123', 'letmein123', 'password1', 'abc12345', '123456789'
    ]
    
    if (commonWeakPasswords.includes(password.toLowerCase())) {
      return NextResponse.json(
        { error: 'This password is too common. Please choose a stronger password' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        name: name || email.split('@')[0],
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
