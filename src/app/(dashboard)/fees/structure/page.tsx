'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Modal } from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'
import { Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function FeeStructurePage() {
  const [structures, setStructures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [years, setYears] = useState<any[]>([])
  const [form, setForm] = useState({ academicYearId: '', termId: '', className: '', amount: '', description: '' })
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  const loadData = () => {
    fetch('/api/fees/structure').then(r => r.json()).then(d => setStructures(d.structures || [])).finally(() => setLoading(false))
    fetch('/api/school-settings').then(r => r.json()).then(d => setYears(d.school?.academicYears || []))
  }

  useEffect(() => { loadData() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/fees/structure', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }) })
      if (!res.ok) throw new Error('Failed')
      addToast('Fee structure created!')
      setShowModal(false)
      loadData()
    } catch { addToast('Failed', 'error') }
    finally { setSaving(false) }
  }

  const terms = years.find((y: any) => y.id === form.academicYearId)?.terms || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Structure</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" /> Add Fee Structure</Button>
      </div>
      <Card>
        {loading ? (
          <div className="flex h-32 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
        ) : (
          <Table>
            <TableHeader><TableRow><TableHead>Academic Year</TableHead><TableHead>Term</TableHead><TableHead>Class</TableHead><TableHead>Amount</TableHead><TableHead>Description</TableHead></TableRow></TableHeader>
            <TableBody>
              {structures.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.academicYear?.name}</TableCell>
                  <TableCell>{s.term?.name || 'All Terms'}</TableCell>
                  <TableCell className="font-medium">{s.className}</TableCell>
                  <TableCell>{formatCurrency(s.amount)}</TableCell>
                  <TableCell>{s.description || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Fee Structure">
        <form onSubmit={handleCreate} className="space-y-4">
          <Select label="Academic Year *" value={form.academicYearId} onChange={(val) => setForm({ ...form, academicYearId: val })}
            options={years.map((y: any) => ({ value: y.id, label: y.name }))} />
          <Select label="Term" value={form.termId} onChange={(val) => setForm({ ...form, termId: val })}
            options={terms.map((t: any) => ({ value: t.id, label: t.name }))} />
          <Input label="Class Name *" value={form.className} onChange={e => setForm({ ...form, className: e.target.value })} required />
          <Input label="Amount (UGX) *" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
          <Input label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}