import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const classId = searchParams.get('classId')
  const date = searchParams.get('date')
  const pupilId = searchParams.get('pupilId')

  const where: any = {}
  if (classId) where.classId = classId
  if (pupilId) where.pupilId = pupilId
  if (date) {
    const d = new Date(date)
    const nextDay = new Date(d)
    nextDay.setDate(d.getDate() + 1)
    where.date = { gte: d, lt: nextDay }
  }

  const attendance = await prisma.attendance.findMany({
    where,
    include: { pupil: true, class: true, markedBy: { select: { name: true } } },
    orderBy: { date: 'desc' },
    take: 500,
  })

  return NextResponse.json({ attendance })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  try {
    const results = await Promise.all(
      body.records.map((record: any) =>
        prisma.attendance.upsert({
          where: {
            pupilId_classId_date: {
              pupilId: record.pupilId,
              classId: body.classId,
              date: new Date(body.date),
            },
          },
          update: {
            status: record.status,
            remarks: record.remarks || null,
          },
          create: {
            pupilId: record.pupilId,
            classId: body.classId,
            date: new Date(body.date),
            status: record.status,
            remarks: record.remarks || null,
            markedById: session.userId,
          },
        })
      )
    )

    return NextResponse.json({ attendance: results })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
