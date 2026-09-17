import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parents = await prisma.parent.findMany({
    include: { pupils: { include: { pupil: { include: { class: true } } } } },
    orderBy: { firstName: 'asc' },
  })

  return NextResponse.json({ parents })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const parent = await prisma.parent.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      email: body.email || null,
      address: body.address || null,
      occupation: body.occupation || null,
      relationship: body.relationship,
    },
  })

  return NextResponse.json({ parent }, { status: 201 })
}
