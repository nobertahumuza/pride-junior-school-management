'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Modal } from '@/components/ui/modal'
import Input from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

export default function ExaminationsPage() {
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', maxMarks: '100', weight: '1' })
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  const loadExams = () => {
    fetch('/api/examinations').then(r => r.json()).then(d => setExams(d.exams || [])).finally(() => setLoading(false))
  }

  useEffect(() => { loadExams() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/examinations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error('Failed')
      addToast('Examination created!')
      setShowModal(false)
      setForm({ name: '', maxMarks: '100', weight: '1' })
      loadExams()
    } catch { addToast('Failed', 'error') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Examinations</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" /> Add Examination</Button>
      </div>
      <Card>
        {loading ? (
          <div className="flex h-32 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
        ) : (
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Max Marks</TableHead><TableHead>Term</TableHead><TableHead>Weight</TableHead></TableRow></TableHeader>
            <TableBody>
              {exams.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell>{e.maxMarks}</TableCell>
                  <TableCell>{e.term?.name}</TableCell>
                  <TableCell>{e.weight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Examination">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mid-Term, End of Term" required />
          <Input label="Max Marks" type="number" value={form.maxMarks} onChange={e => setForm({ ...form, maxMarks: e.target.value })} />
          <Input label="Weight" type="number" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
