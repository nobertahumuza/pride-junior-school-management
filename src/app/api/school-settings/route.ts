import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const school = await prisma.school.findFirst({
    include: {
      academicYears: { include: { terms: true } },
      settings: true,
    },
  })
  return NextResponse.json({ school })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  try {
    const existing = await prisma.school.findFirst()

    let school
    if (existing) {
      school = await prisma.school.update({
        where: { id: existing.id },
        data: {
          name: body.name || existing.name,
          logo: body.logo || existing.logo,
          address: body.address || existing.address,
          phone: body.phone || existing.phone,
          email: body.email || existing.email,
          motto: body.motto || existing.motto,
          registrationNo: body.registrationNo || existing.registrationNo,
          headTeacherName: body.headTeacherName || existing.headTeacherName,
          stamp: body.stamp || existing.stamp,
          currentYear: body.currentYear || existing.currentYear,
          currentTerm: body.currentTerm || existing.currentTerm,
        },
      })
    } else {
      school = await prisma.school.create({
        data: {
          name: body.name,
          logo: body.logo || null,
          address: body.address || null,
          phone: body.phone || null,
          email: body.email || null,
          motto: body.motto || null,
          registrationNo: body.registrationNo || null,
          headTeacherName: body.headTeacherName || null,
          stamp: body.stamp || null,
          currentYear: body.currentYear || null,
          currentTerm: body.currentTerm || null,
        },
      })
    }

    return NextResponse.json({ school })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
