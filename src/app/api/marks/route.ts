import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const classId = searchParams.get('classId')
  const subjectId = searchParams.get('subjectId')
  const examinationId = searchParams.get('examinationId')
  const pupilId = searchParams.get('pupilId')

  const where: any = {}
  if (classId) where.classId = classId
  if (subjectId) where.subjectId = subjectId
  if (examinationId) where.examinationId = examinationId
  if (pupilId) where.pupilId = pupilId

  const marks = await prisma.mark.findMany({
    where,
    include: { pupil: true, subject: true, examination: true, class: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ marks })
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

  try {
    if (Array.isArray(body.marks)) {
      const results = await Promise.all(
        body.marks.map((m: any) =>
          prisma.mark.upsert({
            where: {
              pupilId_subjectId_examinationId_termId: {
                pupilId: m.pupilId,
                subjectId: m.subjectId,
                examinationId: m.examinationId,
                termId: currentTerm.id,
              },
            },
            update: { score: parseFloat(m.score), maxScore: parseFloat(m.maxScore || 100) },
            create: {
              pupilId: m.pupilId,
              classId: m.classId || body.classId,
              subjectId: m.subjectId,
              examinationId: m.examinationId,
              termId: currentTerm.id,
              academicYearId: currentYear.id,
              score: parseFloat(m.score),
              maxScore: parseFloat(m.maxScore || 100),
              assessmentType: m.assessmentType || null,
            },
          })
        )
      )
      return NextResponse.json({ marks: results })
    }

    const mark = await prisma.mark.create({
      data: {
        pupilId: body.pupilId,
        classId: body.classId,
        subjectId: body.subjectId,
        examinationId: body.examinationId || null,
        termId: currentTerm.id,
        academicYearId: currentYear.id,
        score: parseFloat(body.score),
        maxScore: parseFloat(body.maxScore || 100),
        assessmentType: body.assessmentType || null,
      },
    })

    return NextResponse.json({ mark }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
