import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const announcements = await prisma.announcement.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ announcements })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const announcement = await prisma.announcement.create({
    data: {
      title: body.title,
      content: body.content,
      priority: body.priority || 'NORMAL',
      audience: body.audience || 'ALL',
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      createdById: session.userId,
    },
  })

  return NextResponse.json({ announcement }, { status: 201 })
}
