import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const pupilSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum(['Male', 'Female']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  classId: z.string().min(1, 'Class is required'),
  previousSchool: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  address: z.string().optional(),
  medicalNotes: z.string().optional(),
  religion: z.string().optional(),
  nationalId: z.string().optional(),
  parentIds: z.array(z.string()).optional(),
})

export const teacherSchema = z.object({
  staffNumber: z.string().min(1, 'Staff number is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum(['Male', 'Female']),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  qualification: z.string().optional(),
  employmentDate: z.string().optional(),
  employmentType: z.string().default('PERMANENT'),
})

export const parentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  occupation: z.string().optional(),
  relationship: z.string().min(1, 'Relationship is required'),
})

export const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().optional(),
})

export const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  stream: z.string().optional(),
  classTeacherId: z.string().optional(),
})

export const feePaymentSchema = z.object({
  pupilId: z.string().min(1, 'Pupil is required'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  termId: z.string().min(1, 'Term is required'),
  notes: z.string().optional(),
})

export const markSchema = z.object({
  pupilId: z.string().min(1),
  subjectId: z.string().min(1),
  examinationId: z.string().min(1),
  score: z.number().min(0),
  maxScore: z.number().min(1),
})

export const attendanceSchema = z.object({
  classId: z.string().min(1),
  date: z.string().min(1),
  records: z.array(z.object({
    pupilId: z.string(),
    status: z.string(),
    remarks: z.string().optional(),
  })),
})

export const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  priority: z.string().default('NORMAL'),
  audience: z.string().default('ALL'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export const gradingSystemSchema = z.object({
  minScore: z.number().min(0).max(100),
  maxScore: z.number().min(0).max(100),
  grade: z.string().min(1),
  remark: z.string().min(1),
})

export const feeStructureSchema = z.object({
  academicYearId: z.string().min(1),
  termId: z.string().optional(),
  className: z.string().min(1),
  amount: z.number().min(0),
  description: z.string().optional(),
})
