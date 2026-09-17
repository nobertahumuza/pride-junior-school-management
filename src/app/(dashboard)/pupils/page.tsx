'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'

export default function PupilsPage() {
  const [pupils, setPupils] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [classFilter, setClassFilter] = useState('')
  const [classes, setClasses] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/classes').then(r => r.json()).then(d => setClasses(d.classes || []))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (search) params.set('search', search)
    if (classFilter) params.set('classId', classFilter)
    fetch(`/api/pupils?${params}`)
      .then(r => r.json())
      .then(d => { setPupils(d.pupils || []); setTotalPages(d.pages || 1) })
      .finally(() => setLoading(false))
  }, [page, search, classFilter])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to archive this pupil?')) return
    await fetch(`/api/pupils/${id}`, { method: 'DELETE' })
    setPupils(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pupils</h1>
        <Link href="/pupils/new">
          <Button><Plus className="mr-2 h-4 w-4" /> Register Pupil</Button>
        </Link>
      </div>

      <Card>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Search by name or admission number..." /></div>
          <select value={classFilter} onChange={e => { setClassFilter(e.target.value); setPage(1) }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
            <option value="">All Classes</option>
            {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name} {c.stream}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Adm No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pupils.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell><span className="font-mono text-xs">{p.admissionNumber}</span></TableCell>
                    <TableCell className="font-medium">{p.firstName} {p.middleName} {p.lastName}</TableCell>
                    <TableCell>{p.gender}</TableCell>
                    <TableCell>{p.class?.name} {p.class?.stream}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'ACTIVE' ? 'success' : p.status === 'TRANSFERRED' ? 'info' : 'danger'}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(p.admissionDate)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/pupils/${p.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {pupils.length === 0 && <p className="py-8 text-center text-sm text-gray-500">No pupils found</p>}
            <Pagination page={page} pages={totalPages} onPageChange={setPage} />
          </>
        )}
      </Card>
    </div>
  )
}
