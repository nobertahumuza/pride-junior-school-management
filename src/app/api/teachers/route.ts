import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const teachers = await prisma.teacher.findMany({
    include: {
      classes: { include: { subject: true, class: true } },
      _count: { select: { classes: true } },
    },
    orderBy: { firstName: 'asc' },
  })

  return NextResponse.json({ teachers })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  try {
    const teacher = await prisma.teacher.create({
      data: {
        staffNumber: body.staffNumber,
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender,
        phone: body.phone || null,
        email: body.email || null,
        address: body.address || null,
        qualification: body.qualification || null,
        employmentDate: body.employmentDate ? new Date(body.employmentDate) : null,
        employmentType: body.employmentType || 'PERMANENT',
      },
    })

    return NextResponse.json({ teacher }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
