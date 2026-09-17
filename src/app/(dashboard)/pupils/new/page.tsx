'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import Button from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'

export default function NewPupilPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState<any[]>([])
  const [parents, setParents] = useState<any[]>([])
  const [form, setForm] = useState({
    firstName: '', middleName: '', lastName: '', gender: 'Male',
    dateOfBirth: '', classId: '', previousSchool: '',
    emergencyContact: '', emergencyPhone: '', address: '',
    medicalNotes: '', religion: '', nationalId: '',
    parentIds: [] as string[],
  })

  useEffect(() => {
    fetch('/api/classes').then(r => r.json()).then(d => setClasses(d.classes || []))
    fetch('/api/parents').then(r => r.json()).then(d => setParents(d.parents || []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/pupils', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      addToast('Pupil registered successfully!')
      router.push('/pupils')
    } catch (err: any) {
      addToast(err.message || 'Failed to register pupil', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Register New Pupil</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="First Name *" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
            <Input label="Middle Name" value={form.middleName} onChange={e => setForm({ ...form, middleName: e.target.value })} />
            <Input label="Last Name *" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select label="Gender *" value={form.gender} onChange={(val) => setForm({ ...form, gender: val })}
              options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }]} />
            <Input label="Date of Birth *" type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} required />
            <Select label="Class *" value={form.classId} onChange={(val) => setForm({ ...form, classId: val })}
              options={classes.map((c: any) => ({ value: c.id, label: `${c.name} ${c.stream || ''}` }))} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Emergency Contact" value={form.emergencyContact} onChange={e => setForm({ ...form, emergencyContact: e.target.value })} />
            <Input label="Emergency Phone" value={form.emergencyPhone} onChange={e => setForm({ ...form, emergencyPhone: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            <Input label="Religion" value={form.religion} onChange={e => setForm({ ...form, religion: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Previous School" value={form.previousSchool} onChange={e => setForm({ ...form, previousSchool: e.target.value })} />
            <Input label="National ID" value={form.nationalId} onChange={e => setForm({ ...form, nationalId: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Medical Notes</label>
            <textarea value={form.medicalNotes} onChange={e => setForm({ ...form, medicalNotes: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" rows={3} />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register Pupil'}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
