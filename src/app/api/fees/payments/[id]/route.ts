import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const payment = await prisma.feePayment.findUnique({
    where: { id },
    include: { pupil: { include: { class: true } }, academicYear: true, term: true, receivedBy: { select: { name: true } } },
  })

  if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  return NextResponse.json({ payment })
}
