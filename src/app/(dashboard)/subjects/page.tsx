'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Modal } from '@/components/ui/modal'
import Input from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', code: '' })
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  const loadSubjects = () => {
    fetch('/api/subjects').then(r => r.json()).then(d => setSubjects(d.subjects || [])).finally(() => setLoading(false))
  }

  useEffect(() => { loadSubjects() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/subjects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error('Failed')
      addToast('Subject created!')
      setShowModal(false)
      setForm({ name: '', code: '' })
      loadSubjects()
    } catch { addToast('Failed to create subject', 'error') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subjects</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" /> Add Subject</Button>
      </div>
      <Card>
        {loading ? (
          <div className="flex h-32 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
        ) : (
          <Table>
            <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Subject Name</TableHead><TableHead>Classes</TableHead></TableRow></TableHeader>
            <TableBody>
              {subjects.map(s => (
                <TableRow key={s.id}><TableCell>{s.code || '-'}</TableCell><TableCell className="font-medium">{s.name}</TableCell><TableCell>{s._count.classSubjects}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {subjects.length === 0 && !loading && <p className="py-8 text-center text-sm text-gray-500">No subjects yet</p>}
      </Card>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Subject">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Subject Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input label="Subject Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
