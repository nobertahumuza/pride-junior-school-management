import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const subjects = await prisma.subject.findMany({
    include: { _count: { select: { marks: true, classSubjects: true } } },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json({ subjects })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const school = await prisma.school.findFirst()

  if (!school) return NextResponse.json({ error: 'School not configured' }, { status: 400 })

  const subject = await prisma.subject.create({
    data: {
      schoolId: school.id,
      name: body.name,
      code: body.code || null,
    },
  })

  return NextResponse.json({ subject }, { status: 201 })
}
