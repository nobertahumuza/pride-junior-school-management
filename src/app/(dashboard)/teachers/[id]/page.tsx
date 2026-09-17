'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Button from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { ArrowLeft } from 'lucide-react'

export default function TeacherDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/teachers/${params.id}`).then(r => r.json()).then(d => setTeacher(d.teacher)).finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
  if (!teacher) return <div className="py-12 text-center text-gray-500">Teacher not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Profile</h1>
      </div>
      <Card>
        <div className="flex items-start gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-green-100 text-2xl font-bold text-green-600 dark:bg-green-900/30">
            {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{teacher.firstName} {teacher.lastName}</h2>
            <p className="text-sm text-gray-500">Staff: {teacher.staffNumber}</p>
            <div className="mt-2 flex gap-2">
              <Badge variant={teacher.isActive ? 'success' : 'danger'}>{teacher.isActive ? 'Active' : 'Inactive'}</Badge>
              <Badge>{teacher.employmentType}</Badge>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Gender:</span> {teacher.gender}</div>
          <div><span className="text-gray-500">Phone:</span> {teacher.phone || 'N/A'}</div>
          <div><span className="text-gray-500">Email:</span> {teacher.email || 'N/A'}</div>
          <div><span className="text-gray-500">Qualification:</span> {teacher.qualification || 'N/A'}</div>
          <div><span className="text-gray-500">Address:</span> {teacher.address || 'N/A'}</div>
        </div>
      </Card>
      {teacher.classes?.length > 0 && (
        <Card title="Assigned Classes & Subjects">
          <Table>
            <TableHeader><TableRow><TableHead>Class</TableHead><TableHead>Subject</TableHead></TableRow></TableHeader>
            <TableBody>
              {teacher.classes.map((cs: any) => (
                <TableRow key={cs.id}><TableCell>{cs.class?.name}</TableCell><TableCell>{cs.subject?.name}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
