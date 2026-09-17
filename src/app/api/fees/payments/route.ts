import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { generateReceiptNumber } from '@/lib/utils'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const pupilId = searchParams.get('pupilId')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')

  const where: any = {}
  if (pupilId) where.pupilId = pupilId

  const [payments, total] = await Promise.all([
    prisma.feePayment.findMany({
      where,
      include: { pupil: { include: { class: true } }, academicYear: true, term: true, receivedBy: { select: { name: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { paymentDate: 'desc' },
    }),
    prisma.feePayment.count({ where }),
  ])

  return NextResponse.json({ payments, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const currentYear = await prisma.academicYear.findFirst({ where: { isCurrent: true } })
  if (!currentYear) return NextResponse.json({ error: 'No active academic year' }, { status: 400 })

  const receiptNumber = generateReceiptNumber()

  try {
    const payment = await prisma.feePayment.create({
      data: {
        pupilId: body.pupilId,
        academicYearId: currentYear.id,
        termId: body.termId,
        amount: parseFloat(body.amount),
        paymentMethod: body.paymentMethod,
        receiptNumber,
        notes: body.notes || null,
        receivedById: session.userId,
      },
      include: { pupil: { include: { class: true } } },
    })

    return NextResponse.json({ payment }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
