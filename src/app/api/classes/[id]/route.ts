import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const cls = await prisma.class.findUnique({
    where: { id },
    include: {
      pupils: { where: { status: 'ACTIVE' }, orderBy: { firstName: 'asc' } },
      subjects: { include: { subject: true, teacher: true } },
      _count: { select: { pupils: true } },
    },
  })

  if (!cls) return NextResponse.json({ error: 'Class not found' }, { status: 404 })
  return NextResponse.json({ class: cls })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const cls = await prisma.class.update({
    where: { id },
    data: {
      name: body.name,
      stream: body.stream,
      classTeacherId: body.classTeacherId,
    },
  })

  return NextResponse.json({ class: cls })
}
