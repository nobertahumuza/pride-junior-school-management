'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import Button from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { CLASSES } from '@/lib/utils'

export default function NewClassPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [teachers, setTeachers] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', stream: '', classTeacherId: '' })

  useEffect(() => {
    fetch('/api/teachers').then(r => r.json()).then(d => setTeachers(d.teachers || []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      addToast('Class created successfully!')
      router.push('/classes')
    } catch (err: any) {
      addToast(err.message || 'Failed to create class', 'error')
    } finally { setLoading(false) }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Class</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Class Name *" value={form.name} onChange={(val) => setForm({ ...form, name: val })}
            options={CLASSES.map(c => ({ value: c, label: c }))} />
          <Input label="Stream (e.g., East, West, A, B)" value={form.stream} onChange={e => setForm({ ...form, stream: e.target.value })} />
          <Select label="Class Teacher" value={form.classTeacherId} onChange={(val) => setForm({ ...form, classTeacherId: val })}
            options={teachers.map((t: any) => ({ value: t.id, label: `${t.firstName} ${t.lastName}` }))} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Class'}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
