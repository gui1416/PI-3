// app/api/register-nutricionista/route.ts
import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { query } from '@/lib/db'
import { z } from 'zod'

const registerSchema = z.object({
 name: z.string().min(3).max(100),
 crn: z.string().regex(/^\d{6}$/),
 email: z.string().email(),
 senha: z.string().min(8)
})

export async function POST(req: Request) {
 try {
  const body = await req.json()
  const { email, senha, ...rest } = registerSchema.parse(body)

  // Check if user already exists
  const existingUser = await query(
   'SELECT email FROM nutricionistas WHERE email = $1',
   [email]
  )

  if (existingUser.rows.length > 0) {
   return NextResponse.json(
    { message: 'Email já cadastrado' },
    { status: 400 }
   )
  }

  // Check if CRN is already registered
  const existingCRN = await query(
   'SELECT crn FROM nutricionistas WHERE crn = $1',
   [rest.crn]
  )

  if (existingCRN.rows.length > 0) {
   return NextResponse.json(
    { message: 'CRN já cadastrado' },
    { status: 400 }
   )
  }

  // Hash the password
  const hashedPassword = await hash(senha, 10)

  // Insert user into database
  await query(
   'INSERT INTO nutricionistas (name, crn, email, password_hash) VALUES ($1, $2, $3, $4)',
   [rest.name, rest.crn, email, hashedPassword]
  )

  return NextResponse.json(
   { message: 'Nutricionista cadastrado com sucesso' },
   { status: 201 }
  )
 } catch (error) {
  console.error('Registration error:', error)

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