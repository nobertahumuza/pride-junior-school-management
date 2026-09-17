import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const classes = await prisma.class.findMany({
    include: {
      _count: { select: { pupils: true } },
      subjects: { include: { subject: true, teacher: true } },
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json({ classes })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const currentYear = await prisma.academicYear.findFirst({ where: { isCurrent: true } })
  const school = await prisma.school.findFirst()

  if (!currentYear || !school) {
    return NextResponse.json({ error: 'School or academic year not configured' }, { status: 400 })
  }

  try {
    const cls = await prisma.class.create({
      data: {
        schoolId: school.id,
        academicYearId: currentYear.id,
        name: body.name,
        stream: body.stream || null,
        classTeacherId: body.classTeacherId || null,
      },
    })

    return NextResponse.json({ class: cls }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
