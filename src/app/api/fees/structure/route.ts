import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const structures = await prisma.feeStructure.findMany({
    include: { academicYear: true, term: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ structures })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const structure = await prisma.feeStructure.create({
    data: {
      academicYearId: body.academicYearId,
      termId: body.termId || null,
      className: body.className,
      amount: parseFloat(body.amount),
      description: body.description || null,
    },
  })

  return NextResponse.json({ structure }, { status: 201 })
}
