// lib/db.ts
import { Pool } from 'pg'

const pool = new Pool({
 user: process.env.DB_USER || 'mysql',
 password: process.env.DB_PASSWORD || '141605',
 host: process.env.DB_HOST || '127.0.0.1',
 port: parseInt(process.env.DB_PORT || '3306'),
 database: process.env.DB_NAME || 'nutri'
})

export async function query(text: string, params?: any[]) {
 const start = Date.now()
 try {
  const result = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('Executed query', { text, duration, rows: result.rowCount })
  return result
 } catch (error) {
  console.error('Database query error:', error)
  throw error
 }
}

export async function getClient() {
 const client = await pool.connect()
 return client
}