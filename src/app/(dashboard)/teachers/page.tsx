'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/teachers').then(r => r.json()).then(d => setTeachers(d.teachers || [])).finally(() => setLoading(false))
  }, [])

  const filtered = teachers.filter(t =>
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    t.staffNumber.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teachers</h1>
        <Link href="/teachers/new"><Button><Plus className="mr-2 h-4 w-4" /> Add Teacher</Button></Link>
      </div>
      <Card>
        <div className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="Search teachers..." /></div>
        {loading ? (
          <div className="flex h-32 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
        ) : (
          <Table>
            <TableHeader><TableRow><TableHead>Staff No.</TableHead><TableHead>Name</TableHead><TableHead>Gender</TableHead><TableHead>Phone</TableHead><TableHead>Subjects</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell><span className="font-mono text-xs">{t.staffNumber}</span></TableCell>
                  <TableCell className="font-medium">{t.firstName} {t.lastName}</TableCell>
                  <TableCell>{t.gender}</TableCell>
                  <TableCell>{t.phone || 'N/A'}</TableCell>
                  <TableCell>{t.classes?.length || 0} assigned</TableCell>
                  <TableCell><Badge variant={t.isActive ? 'success' : 'danger'}>{t.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell><Button variant="ghost" size="sm" onClick={() => router.push(`/teachers/${t.id}`)}><Eye className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
