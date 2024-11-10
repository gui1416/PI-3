// app/api/login/route.ts
import { NextResponse } from 'next/server'
import { compare } from 'bcrypt'
import { query } from '@/lib/db'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string()
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, senha } = loginSchema.parse(body)

    // Get user from database
    const result = await query(
      'SELECT user_id, email, password_hash, name FROM nutricionistas WHERE email = $1',
      [email]
    )

    const user = result.rows[0]

    if (!user) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Verify password
    const validPassword = await compare(senha, user.password_hash)

    if (!validPassword) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Create session token
    const token = await new SignJWT({ userId: user.user_id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('8h')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET))

    // Set cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8 // 8 hours
    })

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Login error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
