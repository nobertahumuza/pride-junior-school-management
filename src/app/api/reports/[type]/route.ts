import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type } = await params
  const { searchParams } = new URL(request.url)
  const classId = searchParams.get('classId')
  const pupilId = searchParams.get('pupilId')

  const currentYear = await prisma.academicYear.findFirst({ where: { isCurrent: true } })
  const currentTerm = await prisma.term.findFirst({ where: { isCurrent: true } })

  switch (type) {
    case 'attendance': {
      const where: any = {}
      if (classId) where.classId = classId
      if (pupilId) where.pupilId = pupilId
      if (currentYear) where.date = { gte: currentYear.startDate, lte: currentYear.endDate }

      const attendance = await prisma.attendance.findMany({
        where,
        include: { pupil: true, class: true },
        orderBy: { date: 'desc' },
      })
      return NextResponse.json({ report: attendance })
    }

    case 'fees': {
      const payments = await prisma.feePayment.findMany({
        where: currentYear ? { academicYearId: currentYear.id } : {},
        include: { pupil: { include: { class: true } }, term: true },
        orderBy: { paymentDate: 'desc' },
      })
      return NextResponse.json({ report: payments })
    }

    case 'academic': {
      const where: any = {}
      if (classId) where.classId = classId
      if (pupilId) where.pupilId = pupilId
      if (currentTerm) where.termId = currentTerm.id

      const marks = await prisma.mark.findMany({
        where,
        include: { pupil: true, subject: true, examination: true },
      })
      return NextResponse.json({ report: marks })
    }

    case 'pupils': {
      const where: any = { status: 'ACTIVE' }
      if (classId) where.classId = classId

      const pupils = await prisma.pupil.findMany({
        where,
        include: { class: true, parents: { include: { parent: true } } },
        orderBy: { firstName: 'asc' },
      })
      return NextResponse.json({ report: pupils })
    }

    default:
      return NextResponse.json({ error: 'Unknown report type' }, { status: 400 })
  }
}
