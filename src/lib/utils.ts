import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function generateAdmissionNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `ADM/${year}/${random}`
}

export function generateReceiptNumber(): string {
  const date = new Date()
  const prefix = `REC${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`
  const random = Math.floor(Math.random() * 90000) + 10000
  return `${prefix}${random}`
}

export function calculateGrade(score: number, maxScore: number): { grade: string; remark: string } {
  const percentage = (score / maxScore) * 100
  if (percentage >= 80) return { grade: 'A', remark: 'Excellent' }
  if (percentage >= 70) return { grade: 'B', remark: 'Very Good' }
  if (percentage >= 60) return { grade: 'C', remark: 'Good' }
  if (percentage >= 50) return { grade: 'D', remark: 'Fair' }
  return { grade: 'E', remark: 'Needs Improvement' }
}

export function calculateAttendancePercentage(present: number, total: number): number {
  if (total === 0) return 0
  return Math.round((present / total) * 100 * 100) / 100
}

export const CLASSES = [
  'Primary One', 'Primary Two', 'Primary Three', 'Primary Four',
  'Primary Five', 'Primary Six', 'Primary Seven'
]

export const CLASS_SHORT: Record<string, string> = {
  'Primary One': 'P1', 'Primary Two': 'P2', 'Primary Three': 'P3',
  'Primary Four': 'P4', 'Primary Five': 'P5', 'Primary Six': 'P6', 'Primary Seven': 'P7'
}

export const TERMS = ['Term 1', 'Term 2', 'Term 3']
export const STATUSES = ['PRESENT', 'ABSENT', 'LATE', 'SICK', 'EXCUSED']
export const PAYMENT_METHODS = ['Cash', 'Mobile Money', 'Bank', 'Other']
