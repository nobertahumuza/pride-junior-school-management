'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { Save } from 'lucide-react'

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: '', address: '', phone: '', email: '', motto: '',
    registrationNo: '', headTeacherName: '', currentYear: '', currentTerm: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    fetch('/api/school-settings').then(r => r.json()).then(d => {
      if (d.school) {
        setForm({
          name: d.school.name || '', address: d.school.address || '', phone: d.school.phone || '',
          email: d.school.email || '', motto: d.school.motto || '', registrationNo: d.school.registrationNo || '',
          headTeacherName: d.school.headTeacherName || '', currentYear: d.school.currentYear || '',
          currentTerm: d.school.currentTerm || '',
        })
      }
      setLoading(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/school-settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      addToast('Settings saved successfully!')
    } catch { addToast('Failed to save settings', 'error') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">School Settings</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="School Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input label="School Motto" value={form.motto} onChange={e => setForm({ ...form, motto: e.target.value })} />
          <Input label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Registration No" value={form.registrationNo} onChange={e => setForm({ ...form, registrationNo: e.target.value })} />
            <Input label="Head Teacher Name" value={form.headTeacherName} onChange={e => setForm({ ...form, headTeacherName: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Current Academic Year" value={form.currentYear} onChange={e => setForm({ ...form, currentYear: e.target.value })} placeholder="e.g. 2026" />
            <Input label="Current Term" value={form.currentTerm} onChange={e => setForm({ ...form, currentTerm: e.target.value })} placeholder="e.g. Term 1" />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={saving}><Save className="mr-2 h-4 w-4" /> {saving ? 'Saving...' : 'Save Settings'}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
