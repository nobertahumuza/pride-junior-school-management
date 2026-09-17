'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Button from '@/components/ui/button'
import { ArrowLeft, Printer } from 'lucide-react'

export default function ClassDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [cls, setCls] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/classes/${params.id}`).then(r => r.json()).then(d => setCls(d.class)).finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
  if (!cls) return <div className="text-center py-12 text-gray-500">Class not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{cls.name} {cls.stream}</h1>
        <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print</Button>
      </div>

      <Card title={`Pupils in ${cls.name} ${cls.stream || ''} (${cls.pupils?.length || 0})`}>
        <Table>
          <TableHeader><TableRow><TableHead>No.</TableHead><TableHead>Adm No.</TableHead><TableHead>Name</TableHead><TableHead>Gender</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {cls.pupils?.map((p: any, i: number) => (
              <TableRow key={p.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell><span className="font-mono text-xs">{p.admissionNumber}</span></TableCell>
                <TableCell className="font-medium">{p.firstName} {p.middleName} {p.lastName}</TableCell>
                <TableCell>{p.gender}</TableCell>
                <TableCell><Badge variant={p.status === 'ACTIVE' ? 'success' : 'danger'}>{p.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {cls.pupils?.length === 0 && <p className="py-8 text-center text-sm text-gray-500">No pupils in this class yet</p>}
      </Card>

      {cls.subjects?.length > 0 && (
        <Card title="Subjects & Teachers">
          <Table>
            <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Teacher</TableHead></TableRow></TableHeader>
            <TableBody>
              {cls.subjects.map((cs: any) => (
                <TableRow key={cs.id}>
                  <TableCell className="font-medium">{cs.subject?.name}</TableCell>
                  <TableCell>{cs.teacher ? `${cs.teacher.firstName} ${cs.teacher.lastName}` : 'Not assigned'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
