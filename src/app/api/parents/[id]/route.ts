import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const parent = await prisma.parent.findUnique({
    where: { id },
    include: { pupils: { include: { pupil: { include: { class: true, attendance: true, marks: { include: { subject: true } } } } } } },
  })

  if (!parent) return NextResponse.json({ error: 'Parent not found' }, { status: 404 })
  return NextResponse.json({ parent })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const parent = await prisma.parent.update({
    where: { id },
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      email: body.email,
      address: body.address,
      occupation: body.occupation,
      relationship: body.relationship,
    },
  })

  return NextResponse.json({ parent })
}
