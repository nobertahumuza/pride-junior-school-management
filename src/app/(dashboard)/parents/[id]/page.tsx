'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { ArrowLeft } from 'lucide-react'

export default function ParentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [parent, setParent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/parents/${params.id}`).then(r => r.json()).then(d => setParent(d.parent)).finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
  if (!parent) return <div className="py-12 text-center text-gray-500">Parent not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Parent Profile</h1>
      </div>
      <Card>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{parent.firstName} {parent.lastName}</h2>
        <p className="text-sm text-gray-500">{parent.relationship}</p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Phone:</span> {parent.phone}</div>
          <div><span className="text-gray-500">Email:</span> {parent.email || 'N/A'}</div>
          <div><span className="text-gray-500">Occupation:</span> {parent.occupation || 'N/A'}</div>
          <div><span className="text-gray-500">Address:</span> {parent.address || 'N/A'}</div>
        </div>
      </Card>
      {parent.pupils?.length > 0 && (
        <Card title="Children">
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Adm No</TableHead><TableHead>Class</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {parent.pupils.map((pp: any) => (
                <TableRow key={pp.pupil.id}>
                  <TableCell className="font-medium">{pp.pupil.firstName} {pp.pupil.lastName}</TableCell>
                  <TableCell><span className="font-mono text-xs">{pp.pupil.admissionNumber}</span></TableCell>
                  <TableCell>{pp.pupil.class?.name}</TableCell>
                  <TableCell>{pp.pupil.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
