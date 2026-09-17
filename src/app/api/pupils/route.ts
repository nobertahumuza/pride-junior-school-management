import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { generateAdmissionNumber } from '@/lib/utils'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const classId = searchParams.get('classId')
  const search = searchParams.get('search')
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')

  const where: any = {}
  if (classId) where.classId = classId
  if (status) where.status = status
  if (search) {
    where.OR = [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { admissionNumber: { contains: search } },
      { middleName: { contains: search } },
    ]
  }

  const [pupils, total] = await Promise.all([
    prisma.pupil.findMany({
      where,
      include: { class: true, parents: { include: { parent: true } }, academicYear: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.pupil.count({ where }),
  ])

  return NextResponse.json({ pupils, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const admissionNumber = generateAdmissionNumber()

    const school = await prisma.school.findFirst()
    const currentYear = await prisma.academicYear.findFirst({
      where: { isCurrent: true },
    })

    if (!currentYear) {
      return NextResponse.json({ error: 'No active academic year set' }, { status: 400 })
    }

    const pupil = await prisma.pupil.create({
      data: {
        admissionNumber,
        firstName: body.firstName,
        middleName: body.middleName || null,
        lastName: body.lastName,
        gender: body.gender,
        dateOfBirth: new Date(body.dateOfBirth),
        classId: body.classId,
        academicYearId: currentYear.id,
        previousSchool: body.previousSchool || null,
        emergencyContact: body.emergencyContact || null,
        emergencyPhone: body.emergencyPhone || null,
        address: body.address || null,
        medicalNotes: body.medicalNotes || null,
        religion: body.religion || null,
        nationalId: body.nationalId || null,
        parents: body.parentIds?.length
          ? { create: body.parentIds.map((id: string) => ({ parentId: id })) }
          : undefined,
      },
      include: { class: true, parents: { include: { parent: true } } },
    })

    return NextResponse.json({ pupil }, { status: 201 })
  } catch (error: any) {
    console.error('Create pupil error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create pupil' }, { status: 500 })
  }
}
