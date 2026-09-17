'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import Button from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { PAYMENT_METHODS } from '@/lib/utils'

export default function NewPaymentPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [pupils, setPupils] = useState<any[]>([])
  const [terms, setTerms] = useState<any[]>([])
  const [form, setForm] = useState({ pupilId: '', amount: '', paymentMethod: 'Cash', termId: '', notes: '' })

  useEffect(() => {
    fetch('/api/pupils?limit=1000').then(r => r.json()).then(d => setPupils(d.pupils || []))
    fetch('/api/school-settings').then(r => r.json()).then(d => {
      const year = d.school?.academicYears?.find((y: any) => y.isCurrent)
      setTerms(year?.terms || [])
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/fees/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      addToast(`Payment recorded! Receipt: ${data.payment.receiptNumber}`)
      router.push('/fees/payments')
    } catch (err: any) { addToast(err.message, 'error') }
    finally { setLoading(false) }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Record Payment</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Pupil *" value={form.pupilId} onChange={(val) => setForm({ ...form, pupilId: val })}
            options={pupils.map((p: any) => ({ value: p.id, label: `${p.firstName} ${p.lastName} (${p.admissionNumber})` }))} />
          <Select label="Term *" value={form.termId} onChange={(val) => setForm({ ...form, termId: val })}
            options={terms.map((t: any) => ({ value: t.id, label: t.name }))} />
          <Input label="Amount (UGX) *" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
          <Select label="Payment Method *" value={form.paymentMethod} onChange={(val) => setForm({ ...form, paymentMethod: val })}
            options={PAYMENT_METHODS.map(m => ({ value: m, label: m }))} />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" rows={3} />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Recording...' : 'Record Payment'}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}