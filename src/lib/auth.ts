import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret')

export interface JWTPayload {
  userId: string
  email: string
  name: string
  role: string
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}

export function hasRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole)
}

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ['*'],
  HEAD_TEACHER: ['dashboard', 'pupils', 'teachers', 'classes', 'subjects', 'attendance', 'fees', 'marks', 'reports', 'announcements', 'settings', 'parents', 'promotions', 'report-cards', 'users', 'backup'],
  DEPUTY_HEAD_TEACHER: ['dashboard', 'pupils', 'teachers', 'classes', 'subjects', 'attendance', 'fees', 'marks', 'reports', 'announcements', 'parents', 'promotions', 'report-cards'],
  TEACHER: ['dashboard', 'pupils', 'attendance', 'marks', 'report-cards'],
  CLASS_TEACHER: ['dashboard', 'pupils', 'attendance', 'marks', 'report-cards'],
  BURSAR: ['dashboard', 'fees', 'reports', 'pupils'],
  PARENT: ['dashboard', 'children'],
}

export const ROLES = ['SUPER_ADMIN', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER', 'TEACHER', 'CLASS_TEACHER', 'BURSAR', 'PARENT']
