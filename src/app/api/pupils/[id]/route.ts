import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const pupil = await prisma.pupil.findUnique({
    where: { id },
    include: {
      class: true,
      academicYear: true,
      parents: { include: { parent: true } },
      attendance: { orderBy: { date: 'desc' }, take: 30 },
      marks: { include: { subject: true, examination: true }, orderBy: { createdAt: 'desc' } },
    },
  })

  if (!pupil) return NextResponse.json({ error: 'Pupil not found' }, { status: 404 })
  return NextResponse.json({ pupil })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  try {
    const pupil = await prisma.pupil.update({
      where: { id },
      data: {
        firstName: body.firstName,
        middleName: body.middleName || null,
        lastName: body.lastName,
        gender: body.gender,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        classId: body.classId,
        previousSchool: body.previousSchool || null,
        emergencyContact: body.emergencyContact || null,
        emergencyPhone: body.emergencyPhone || null,
        address: body.address || null,
        medicalNotes: body.medicalNotes || null,
        religion: body.religion || null,
        nationalId: body.nationalId || null,
        status: body.status,
      },
      include: { class: true },
    })

    return NextResponse.json({ pupil })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.pupil.update({ where: { id }, data: { status: 'ARCHIVED' } })
  return NextResponse.json({ success: true })
}
