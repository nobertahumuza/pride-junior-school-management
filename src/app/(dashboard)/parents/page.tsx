'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Plus, Eye } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ParentsPage() {
  const [parents, setParents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/parents').then(r => r.json()).then(d => setParents(d.parents || [])).finally(() => setLoading(false))
  }, [])

  const filtered = parents.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Parents/Guardians</h1>
        <Link href="/parents/new"><Button><Plus className="mr-2 h-4 w-4" /> Add Parent</Button></Link>
      </div>
      <Card>
        <div className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="Search by name or phone..." /></div>
        {loading ? (
          <div className="flex h-32 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
        ) : (
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>Relationship</TableHead><TableHead>Children</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.firstName} {p.lastName}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>{p.relationship}</TableCell>
                  <TableCell>{p.pupils?.length || 0}</TableCell>
                  <TableCell><Button variant="ghost" size="sm" onClick={() => router.push(`/parents/${p.id}`)}><Eye className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
