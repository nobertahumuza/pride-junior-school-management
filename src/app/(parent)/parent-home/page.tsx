'use client'
import { useState, useEffect } from 'react'
import { Card, StatCard } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, DollarSign, ClipboardCheck, FileText } from 'lucide-react'
import { formatDate, formatCurrency, calculateGrade } from '@/lib/utils'

export default function ParentDashboardPage() {
  const [children, setChildren] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedChild, setSelectedChild] = useState<any>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(async d => {
      if (d.user) {
        const res = await fetch(`/api/parents/${d.user.parentId || ''}`)
        const data = await res.json()
        setChildren(data.parent?.pupils?.map((pp: any) => pp.pupil) || [])
        if (data.parent?.pupils?.length > 0) setSelectedChild(data.parent.pupils[0].pupil)
      }
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Parent Dashboard</h1>
        {children.length > 1 && (
          <select value={selectedChild?.id || ''} onChange={e => setSelectedChild(children.find(c => c.id === e.target.value))}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
            {children.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
          </select>
        )}
      </div>
      {selectedChild ? (
        <div className="space-y-6">
          <Card>
            <div className="flex items-start gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-blue-100 text-2xl font-bold text-blue-600">
                {selectedChild.firstName?.charAt(0)}{selectedChild.lastName?.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedChild.firstName} {selectedChild.lastName}</h2>
                <p className="text-sm text-gray-500">Adm No: {selectedChild.admissionNumber}</p>
                <p className="text-sm text-gray-500">Class: {selectedChild.class?.name}</p>
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card title="Academic Performance">
              <p className="text-sm text-gray-500">View academic results and report cards in the Report Cards section.</p>
            </Card>
            <Card title="Fee Balance">
              <p className="text-sm text-gray-500">View fee payments and outstanding balances in the Fees section.</p>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <p className="py-8 text-center text-gray-500">No children linked to your account. Please contact the school administrator.</p>
        </Card>
      )}
    </div>
  )
}
