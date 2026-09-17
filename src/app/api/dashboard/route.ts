import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const currentYear = await prisma.academicYear.findFirst({ where: { isCurrent: true } })
  const currentTerm = await prisma.term.findFirst({ where: { isCurrent: true } })
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const [
    totalPupils,
    malePupils,
    femalePupils,
    totalTeachers,
    totalClasses,
    todayAttendance,
    absentToday,
    lateToday,
    totalFeesRequired,
    totalFeesPaid,
    recentAnnouncements,
    classDistribution,
  ] = await Promise.all([
    prisma.pupil.count({ where: { status: 'ACTIVE' } }),
    prisma.pupil.count({ where: { status: 'ACTIVE', gender: 'Male' } }),
    prisma.pupil.count({ where: { status: 'ACTIVE', gender: 'Female' } }),
    prisma.teacher.count({ where: { isActive: true } }),
    prisma.class.count(),
    prisma.attendance.count({
      where: { date: { gte: today, lt: tomorrow }, status: 'PRESENT' },
    }),
    prisma.attendance.count({
      where: { date: { gte: today, lt: tomorrow }, status: 'ABSENT' },
    }),
    prisma.attendance.count({
      where: { date: { gte: today, lt: tomorrow }, status: 'LATE' },
    }),
    prisma.feeStructure.aggregate({
      _sum: { amount: true },
      where: currentYear ? { academicYearId: currentYear.id } : {},
    }),
    prisma.feePayment.aggregate({
      _sum: { amount: true },
      where: currentYear ? { academicYearId: currentYear.id } : {},
    }),
    prisma.announcement.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } },
    }),
    prisma.class.findMany({
      include: { _count: { select: { pupils: true } } },
    }),
  ])

  return NextResponse.json({
    totalPupils,
    malePupils,
    femalePupils,
    totalTeachers,
    totalClasses,
    todayAttendance: todayAttendance + lateToday,
    absentToday,
    lateToday,
    feesRequired: totalFeesRequired._sum.amount || 0,
    feesPaid: totalFeesPaid._sum.amount || 0,
    outstandingFees: (totalFeesRequired._sum.amount || 0) - (totalFeesPaid._sum.amount || 0),
    currentYear: currentYear?.name || 'Not set',
    currentTerm: currentTerm?.name || 'Not set',
    announcements: recentAnnouncements,
    classDistribution,
  })
}
