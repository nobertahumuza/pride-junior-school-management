'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Button from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { formatDate, calculateGrade, formatCurrency } from '@/lib/utils'
import { ArrowLeft, Printer } from 'lucide-react'
import Link from 'next/link'

export default function PupilDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [pupil, setPupil] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/pupils/${params.id}`)
      .then(r => r.json())
      .then(d => setPupil(d.pupil))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
  if (!pupil) return <div className="text-center py-12 text-gray-500">Pupil not found</div>

  const attendance = pupil.attendance || []
  const presentDays = attendance.filter((a: any) => a.status === 'PRESENT' || a.status === 'LATE').length
  const totalDays = attendance.length
  const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

  const marks = pupil.marks || []
  const avgScore = marks.length > 0 ? marks.reduce((sum: number, m: any) => sum + (m.score / m.maxScore) * 100, 0) / marks.length : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pupil Profile</h1>
        <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-start gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-blue-100 text-3xl font-bold text-blue-600 dark:bg-blue-900/30">
              {pupil.firstName.charAt(0)}{pupil.lastName.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{pupil.firstName} {pupil.middleName} {pupil.lastName}</h2>
              <p className="text-sm text-gray-500">Admission: {pupil.admissionNumber}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="info">{pupil.class?.name} {pupil.class?.stream}</Badge>
                <Badge variant={pupil.gender === 'Male' ? 'default' : 'warning'}>{pupil.gender}</Badge>
                <Badge variant={pupil.status === 'ACTIVE' ? 'success' : 'danger'}>{pupil.status}</Badge>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Date of Birth:</span> <span className="font-medium">{formatDate(pupil.dateOfBirth)}</span></div>
            <div><span className="text-gray-500">Admission Date:</span> <span className="font-medium">{formatDate(pupil.admissionDate)}</span></div>
            <div><span className="text-gray-500">Emergency Contact:</span> <span className="font-medium">{pupil.emergencyContact || 'N/A'}</span></div>
            <div><span className="text-gray-500">Emergency Phone:</span> <span className="font-medium">{pupil.emergencyPhone || 'N/A'}</span></div>
            <div><span className="text-gray-500">Address:</span> <span className="font-medium">{pupil.address || 'N/A'}</span></div>
            <div><span className="text-gray-500">Religion:</span> <span className="font-medium">{pupil.religion || 'N/A'}</span></div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card title="Summary">
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm text-gray-500">Attendance</span><span className="font-bold">{attendancePct}%</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Days Present</span><span className="font-medium">{presentDays}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Days Absent</span><span className="font-medium">{totalDays - presentDays}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Average Score</span><span className="font-bold">{avgScore.toFixed(1)}%</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Overall Grade</span><span className="font-bold">{calculateGrade(avgScore, 100).grade}</span></div>
            </div>
          </Card>

          <Card title="Parents/Guardians">
            {pupil.parents?.length > 0 ? pupil.parents.map((pp: any) => (
              <div key={pp.parent.id} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="font-medium text-gray-900 dark:text-white">{pp.parent.firstName} {pp.parent.lastName}</p>
                <p className="text-xs text-gray-500">{pp.parent.relationship} - {pp.parent.phone}</p>
              </div>
            )) : <p className="text-sm text-gray-500">No parents linked</p>}
          </Card>
        </div>
      </div>

      <Card title="Recent Marks">
        <Table>
          <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Exam</TableHead><TableHead>Score</TableHead><TableHead>Grade</TableHead></TableRow></TableHeader>
          <TableBody>
            {marks.slice(0, 20).map((m: any) => {
              const g = calculateGrade(m.score, m.maxScore)
              return (
                <TableRow key={m.id}>
                  <TableCell>{m.subject?.name}</TableCell>
                  <TableCell>{m.examination?.name || m.assessmentType}</TableCell>
                  <TableCell>{m.score}/{m.maxScore}</TableCell>
                  <TableCell><Badge variant={g.grade === 'A' || g.grade === 'B' ? 'success' : g.grade === 'C' ? 'info' : 'warning'}>{g.grade}</Badge></TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {marks.length === 0 && <p className="py-4 text-center text-sm text-gray-500">No marks recorded yet</p>}
      </Card>
    </div>
  )
}
