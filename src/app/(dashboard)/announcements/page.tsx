'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import { formatDate } from '@/lib/utils'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', priority: 'NORMAL', audience: 'ALL' })
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  const loadData = () => {
    fetch('/api/announcements').then(r => r.json()).then(d => setAnnouncements(d.announcements || [])).finally(() => setLoading(false))
  }
  useEffect(() => { loadData() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/announcements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error('Failed')
      addToast('Announcement created!')
      setShowModal(false)
      setForm({ title: '', content: '', priority: 'NORMAL', audience: 'ALL' })
      loadData()
    } catch { addToast('Failed', 'error') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" /> New Announcement</Button>
      </div>
      {loading ? (
        <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
      ) : (
        <div className="space-y-4">
          {announcements.map(a => (
            <Card key={a.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">{a.title}</h3>
                    <Badge variant={a.priority === 'HIGH' ? 'danger' : a.priority === 'LOW' ? 'default' : 'info'}>{a.priority}</Badge>
                    <Badge variant="success">{a.audience}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{a.content}</p>
                  <p className="mt-2 text-xs text-gray-400">By {a.author?.name} - {formatDate(a.createdAt)}</p>
                </div>
              </div>
            </Card>
          ))}
          {announcements.length === 0 && <p className="text-center text-gray-500 py-8">No announcements</p>}
        </div>
      )}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Announcement">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content *</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" rows={4} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Priority" value={form.priority} onChange={(val) => setForm({ ...form, priority: val })}
              options={[{ value: 'LOW', label: 'Low' }, { value: 'NORMAL', label: 'Normal' }, { value: 'HIGH', label: 'High' }]} />
            <Select label="Audience" value={form.audience} onChange={(val) => setForm({ ...form, audience: val })}
              options={[{ value: 'ALL', label: 'All' }, { value: 'TEACHERS', label: 'Teachers' }, { value: 'PARENTS', label: 'Parents' }, { value: 'PUPILS', label: 'Pupils' }]} />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
