'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import Button from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'

export default function NewTeacherPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    staffNumber: '', firstName: '', lastName: '', gender: 'Male',
    phone: '', email: '', address: '', qualification: '',
    employmentDate: '', employmentType: 'PERMANENT',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      addToast('Teacher added successfully!')
      router.push('/teachers')
    } catch (err: any) {
      addToast(err.message, 'error')
    } finally { setLoading(false) }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Teacher</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="Staff Number *" value={form.staffNumber} onChange={e => setForm({ ...form, staffNumber: e.target.value })} required />
            <Input label="First Name *" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
            <Input label="Last Name *" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select label="Gender *" value={form.gender} onChange={(val) => setForm({ ...form, gender: val })}
              options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }]} />
            <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Qualification" value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} />
            <Input label="Employment Date" type="date" value={form.employmentDate} onChange={e => setForm({ ...form, employmentDate: e.target.value })} />
          </div>
          <Input label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Teacher'}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
