import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

let seeded = false

async function seedDatabase() {
  if (seeded) return true
  const count = await prisma.user.count()
  if (count > 0) { seeded = true; return true }

  console.log('Auto-seeding database...')

  const school = await prisma.school.create({
    data: {
      name: 'Pride Junior School',
      address: 'P.O. Box 1234, Kampala, Uganda',
      phone: '+256-700-123456',
      email: 'info@pridejunior.sc.ug',
      motto: 'Excellence in Education',
      registrationNo: 'U/MES/0234',
      headTeacherName: 'Mr. James Okello',
      currentYear: '2026',
      currentTerm: 'Term 1',
    },
  })

  const year = await prisma.academicYear.create({
    data: { schoolId: school.id, name: '2026', startDate: new Date('2026-01-15'), endDate: new Date('2026-12-10'), isCurrent: true },
  })

  const term1 = await prisma.term.create({ data: { academicYearId: year.id, name: 'Term 1', startDate: new Date('2026-01-15'), endDate: new Date('2026-04-15'), isCurrent: true } })
  await prisma.term.create({ data: { academicYearId: year.id, name: 'Term 2', startDate: new Date('2026-05-05'), endDate: new Date('2026-08-05'), isCurrent: false } })
  await prisma.term.create({ data: { academicYearId: year.id, name: 'Term 3', startDate: new Date('2026-09-01'), endDate: new Date('2026-12-10'), isCurrent: false } })

  const adminPass = await bcrypt.hash('admin123', 10)
  const teacherPass = await bcrypt.hash('teacher123', 10)
  const bursarPass = await bcrypt.hash('bursar123', 10)
  const parentPass = await bcrypt.hash('parent123', 10)

  await prisma.user.create({ data: { email: 'admin@school.com', password: adminPass, name: 'System Admin', role: 'SUPER_ADMIN' } })
  const bursarUser = await prisma.user.create({ data: { email: 'bursar@school.com', password: bursarPass, name: 'Sarah Nakamya', role: 'BURSAR' } })

  const t1 = await prisma.teacher.create({ data: { staffNumber: 'T001', firstName: 'James', lastName: 'Okello', gender: 'Male', phone: '+256-701-111111', email: 'james@school.com', qualification: 'B.Ed', employmentDate: new Date('2015-01-10') } })
  const t2 = await prisma.teacher.create({ data: { staffNumber: 'T002', firstName: 'Mary', lastName: 'Nambogo', gender: 'Female', phone: '+256-702-222222', qualification: 'Diploma in Education', employmentDate: new Date('2018-03-15') } })
  const t3 = await prisma.teacher.create({ data: { staffNumber: 'T003', firstName: 'Peter', lastName: 'Ssemwanga', gender: 'Male', phone: '+256-703-333333', qualification: 'B.Ed', employmentDate: new Date('2020-06-01') } })

  await prisma.user.create({ data: { email: 'teacher@school.com', password: teacherPass, name: 'James Okello', role: 'TEACHER', teacherId: t1.id } })

  const eng = await prisma.subject.create({ data: { schoolId: school.id, name: 'English', code: 'ENG' } })
  const math = await prisma.subject.create({ data: { schoolId: school.id, name: 'Mathematics', code: 'MATH' } })
  const science = await prisma.subject.create({ data: { schoolId: school.id, name: 'Science', code: 'SCI' } })
  const sst = await prisma.subject.create({ data: { schoolId: school.id, name: 'Social Studies', code: 'SST' } })
  const re = await prisma.subject.create({ data: { schoolId: school.id, name: 'Religious Education', code: 'RE' } })
  const lit = await prisma.subject.create({ data: { schoolId: school.id, name: 'Literacy', code: 'LIT' } })
  const pe = await prisma.subject.create({ data: { schoolId: school.id, name: 'Physical Education', code: 'PE' } })
  const local = await prisma.subject.create({ data: { schoolId: school.id, name: 'Local Language', code: 'LL' } })
  const art = await prisma.subject.create({ data: { schoolId: school.id, name: 'Creative Arts', code: 'ART' } })

  const p1 = await prisma.class.create({ data: { schoolId: school.id, academicYearId: year.id, name: 'Primary One', classTeacherId: t1.id } })
  const p2 = await prisma.class.create({ data: { schoolId: school.id, academicYearId: year.id, name: 'Primary Two', classTeacherId: t2.id } })
  const p3 = await prisma.class.create({ data: { schoolId: school.id, academicYearId: year.id, name: 'Primary Three', classTeacherId: t3.id } })
  const p4 = await prisma.class.create({ data: { schoolId: school.id, academicYearId: year.id, name: 'Primary Four', classTeacherId: t1.id } })
  const p5 = await prisma.class.create({ data: { schoolId: school.id, academicYearId: year.id, name: 'Primary Five', classTeacherId: t2.id } })
  const p6 = await prisma.class.create({ data: { schoolId: school.id, academicYearId: year.id, name: 'Primary Six', classTeacherId: t3.id } })
  const p7 = await prisma.class.create({ data: { schoolId: school.id, academicYearId: year.id, name: 'Primary Seven', classTeacherId: t1.id } })

  const allClasses = [p1, p2, p3, p4, p5, p6, p7]
  const primarySubjects = [eng, math, science, sst, re, lit, pe, local, art]
  for (const cls of allClasses) {
    for (const sub of primarySubjects) {
      await prisma.classSubject.create({ data: { classId: cls.id, subjectId: sub.id, teacherId: t1.id } })
    }
  }

  const parent1 = await prisma.parent.create({ data: { firstName: 'John', lastName: 'Mugisha', phone: '+256-704-444444', email: 'john@mugisha.com', relationship: 'Father', occupation: 'Teacher', address: 'Kampala' } })
  const parent2 = await prisma.parent.create({ data: { firstName: 'Grace', lastName: 'Achieng', phone: '+256-705-555555', relationship: 'Mother', occupation: 'Nurse', address: 'Entebbe' } })
  const parent3 = await prisma.parent.create({ data: { firstName: 'David', lastName: 'Tumwine', phone: '+256-706-666666', relationship: 'Father', occupation: 'Business', address: 'Mukono' } })

  await prisma.user.create({ data: { email: 'parent@school.com', password: parentPass, name: 'John Mugisha', role: 'PARENT', parentId: parent1.id } })

  const pupilData = [
    { firstName: 'Brian', lastName: 'Mugisha', gender: 'Male', classId: p4.id, parentIds: [parent1.id] },
    { firstName: 'Esther', lastName: 'Mugisha', gender: 'Female', classId: p2.id, parentIds: [parent1.id] },
    { firstName: 'Samuel', lastName: 'Achieng', gender: 'Male', classId: p4.id, parentIds: [parent2.id] },
    { firstName: 'Sarah', lastName: 'Achieng', gender: 'Female', classId: p3.id, parentIds: [parent2.id] },
    { firstName: 'Moses', lastName: 'Tumwine', gender: 'Male', classId: p5.id, parentIds: [parent3.id] },
    { firstName: 'Agnes', lastName: 'Tumwine', gender: 'Female', classId: p4.id, parentIds: [parent3.id] },
    { firstName: 'Kevin', lastName: 'Byaruhanga', gender: 'Male', classId: p4.id, parentIds: [] },
    { firstName: 'Juliet', lastName: 'Nansubuga', gender: 'Female', classId: p4.id, parentIds: [] },
    { firstName: 'Isaac', lastName: 'Mpamire', gender: 'Male', classId: p5.id, parentIds: [] },
    { firstName: 'Patience', lastName: 'Nalubega', gender: 'Female', classId: p3.id, parentIds: [] },
    { firstName: 'Elijah', lastName: 'Kiggundu', gender: 'Male', classId: p6.id, parentIds: [] },
    { firstName: 'Ruth', lastName: 'Namutebi', gender: 'Female', classId: p7.id, parentIds: [] },
    { firstName: 'Daniel', lastName: 'Wasswa', gender: 'Male', classId: p7.id, parentIds: [] },
    { firstName: 'Priscilla', lastName: 'Nankwanga', gender: 'Female', classId: p6.id, parentIds: [] },
    { firstName: 'Andrew', lastName: 'Sekitooleko', gender: 'Male', classId: p5.id, parentIds: [] },
    { firstName: 'Deborah', lastName: 'Namayanja', gender: 'Female', classId: p1.id, parentIds: [] },
    { firstName: 'Isaac', lastName: 'Lugoloobi', gender: 'Male', classId: p1.id, parentIds: [] },
    { firstName: 'Naomi', lastName: 'Kukirya', gender: 'Female', classId: p2.id, parentIds: [] },
    { firstName: 'Joseph', lastName: 'Mugerwa', gender: 'Male', classId: p3.id, parentIds: [] },
    { firstName: 'Hannah', lastName: 'Ssemanda', gender: 'Female', classId: p6.id, parentIds: [] },
  ]

  const pupils: any[] = []
  for (let i = 0; i < pupilData.length; i++) {
    const pd = pupilData[i]
    const pupil = await prisma.pupil.create({
      data: {
        admissionNumber: `ADM/2026/${1001 + i}`,
        firstName: pd.firstName,
        lastName: pd.lastName,
        gender: pd.gender,
        dateOfBirth: new Date(`${2015 + (i % 5)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`),
        classId: pd.classId,
        academicYearId: year.id,
        admissionDate: new Date('2026-01-15'),
        parents: pd.parentIds.length > 0 ? { create: pd.parentIds.map((id: string) => ({ parentId: id })) } : undefined,
      },
    })
    pupils.push(pupil)
  }

  const midTerm = await prisma.examination.create({ data: { name: 'Mid-Term Exam', termId: term1.id, academicYearId: year.id, maxMarks: 100, weight: 0.4 } })
  const endTerm = await prisma.examination.create({ data: { name: 'End of Term Exam', termId: term1.id, academicYearId: year.id, maxMarks: 100, weight: 0.6 } })

  const p4Pupils = pupils.filter(p => p.classId === p4.id)
  const p4Subjects = [eng, math, science, sst, re]
  for (const pupil of p4Pupils) {
    for (const subject of p4Subjects) {
      const midScore = 50 + Math.floor(Math.random() * 40)
      const endScore = 50 + Math.floor(Math.random() * 40)
      await prisma.mark.create({ data: { pupilId: pupil.id, classId: p4.id, subjectId: subject.id, examinationId: midTerm.id, termId: term1.id, academicYearId: year.id, score: midScore, maxScore: 100 } })
      await prisma.mark.create({ data: { pupilId: pupil.id, classId: p4.id, subjectId: subject.id, examinationId: endTerm.id, termId: term1.id, academicYearId: year.id, score: endScore, maxScore: 100 } })
    }
  }

  for (const pupil of pupils.slice(0, 10)) {
    const statuses = ['PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'LATE', 'PRESENT', 'PRESENT', 'SICK', 'EXCUSED']
    for (let d = 1; d <= 20; d++) {
      await prisma.attendance.create({
        data: {
          pupilId: pupil.id,
          classId: pupil.classId,
          date: new Date(`2026-02-${String(d).padStart(2, '0')}`),
          status: statuses[d % statuses.length],
          markedById: (await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } }))!.id,
        },
      })
    }
  }

  const feeAmounts = [150000, 150000, 160000, 180000, 200000, 220000, 250000]
  const classNames = ['Primary One', 'Primary Two', 'Primary Three', 'Primary Four', 'Primary Five', 'Primary Six', 'Primary Seven']
  for (let i = 0; i < classNames.length; i++) {
    await prisma.feeStructure.create({ data: { academicYearId: year.id, termId: term1.id, className: classNames[i], amount: feeAmounts[i], description: 'School fees for Term 1' } })
  }

  for (const pupil of pupils.slice(0, 8)) {
    await prisma.feePayment.create({
      data: {
        pupilId: pupil.id,
        academicYearId: year.id,
        termId: term1.id,
        amount: 50000 + Math.floor(Math.random() * 150000),
        paymentMethod: ['Cash', 'Mobile Money', 'Bank'][Math.floor(Math.random() * 3)],
        receiptNumber: `REC202601${String(10001 + Math.floor(Math.random() * 90000)).slice(0, 5)}`,
        receivedById: bursarUser.id,
      },
    })
  }

  const adminUserId = (await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } }))!.id
  await prisma.announcement.create({ data: { title: 'School Re-opening', content: 'School re-opens on 15th January 2026. All pupils should report with their school requirements.', priority: 'HIGH', audience: 'ALL', createdById: adminUserId } })
  await prisma.announcement.create({ data: { title: 'Parent-Teacher Meeting', content: 'A parent-teacher meeting will be held on 28th February 2026. All parents are encouraged to attend.', priority: 'NORMAL', audience: 'PARENTS', createdById: adminUserId } })
  await prisma.announcement.create({ data: { title: 'Mid-Term Examinations', content: 'Mid-term examinations will begin on 10th March 2026. All pupils should prepare well.', priority: 'NORMAL', audience: 'ALL', createdById: adminUserId } })

  const gradings = [
    { minScore: 80, maxScore: 100, grade: 'A', remark: 'Excellent' },
    { minScore: 70, maxScore: 79, grade: 'B', remark: 'Very Good' },
    { minScore: 60, maxScore: 69, grade: 'C', remark: 'Good' },
    { minScore: 50, maxScore: 59, grade: 'D', remark: 'Fair' },
    { minScore: 0, maxScore: 49, grade: 'E', remark: 'Needs Improvement' },
  ]
  for (const g of gradings) {
    await prisma.gradingSystem.create({ data: g })
  }

  seeded = true
  console.log('Database seeded successfully!')
  return true
}

export async function GET(request: NextRequest) {
  try {
    await seedDatabase()
    return NextResponse.json({ success: true, message: 'Database initialized with demo data' })
  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
