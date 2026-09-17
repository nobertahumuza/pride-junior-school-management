import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const exams = await prisma.examination.findMany({
    include: { term: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ exams })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const currentYear = await prisma.academicYear.findFirst({ where: { isCurrent: true } })
  const currentTerm = await prisma.term.findFirst({ where: { isCurrent: true } })

  if (!currentYear || !currentTerm) {
    return NextResponse.json({ error: 'No active academic year or term' }, { status: 400 })
  }

  const exam = await prisma.examination.create({
    data: {
      name: body.name,
      termId: currentTerm.id,
      academicYearId: currentYear.id,
      maxMarks: parseFloat(body.maxMarks || 100),
      weight: parseFloat(body.weight || 1),
    },
  })

  return NextResponse.json({ exam }, { status: 201 })
}
