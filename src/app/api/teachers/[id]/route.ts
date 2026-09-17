import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: {
      classes: { include: { subject: true, class: true } },
      user: { select: { email: true, role: true } },
    },
  })

  if (!teacher) return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
  return NextResponse.json({ teacher })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const teacher = await prisma.teacher.update({
    where: { id },
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      gender: body.gender,
      phone: body.phone,
      email: body.email,
      address: body.address,
      qualification: body.qualification,
      employmentType: body.employmentType,
      isActive: body.isActive,
    },
  })

  return NextResponse.json({ teacher })
}
