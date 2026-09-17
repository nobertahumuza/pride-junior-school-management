'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Select from '@/components/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { Save } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'PRESENT', label: 'Present' },
  { value: 'ABSENT', label: 'Absent' },
  { value: 'LATE', label: 'Late' },
  { value: 'SICK', label: 'Sick' },
  { value: 'EXCUSED', label: 'Excused' },
]

export default function AttendancePage() {
  const [classes, setClasses] = useState<any[]>([])
  const [pupils, setPupils] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [records, setRecords] = useState<Record<string, string>>({})
  const [existing, setExisting] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    fetch('/api/classes').then(r => r.json()).then(d => setClasses(d.classes || []))
  }, [])

  useEffect(() => {
    if (selectedClass) {
      setLoading(true)
      const params = new URLSearchParams({ classId: selectedClass, date })
      fetch(`/api/attendance?${params}`)
        .then(r => r.json())
        .then(d => {
          setExisting(d.attendance || [])
          const initial: Record<string, string> = {}
          d.attendance.forEach((a: any) => { initial[a.pupilId] = a.status })
          setRecords(initial)
        })
        .finally(() => setLoading(false))
      fetch(`/api/pupils?classId=${selectedClass}&limit=100`)
        .then(r => r.json())
        .then(d => setPupils(d.pupils || []))
    }
  }, [selectedClass, date])

  const handleSave = async () => {
    if (!selectedClass) return
    setSaving(true)
    try {
      const recs = pupils.map(p => ({ pupilId: p.id, status: records[p.id] || 'ABSENT' }))
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId: selectedClass, date, records: recs }),
      })
      if (!res.ok) throw new Error('Failed')
      addToast('Attendance saved successfully!')
    } catch { addToast('Failed to save attendance', 'error') }
    finally { setSaving(false) }
  }

  const stats = { present: 0, absent: 0, late: 0, sick: 0, excused: 0 }
  Object.values(records).forEach(s => {
    if (s === 'PRESENT') stats.present++
    else if (s === 'ABSENT') stats.absent++
    else if (s === 'LATE') stats.late++
    else if (s === 'SICK') stats.sick++
    else if (s === 'EXCUSED') stats.excused++
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
      <Card>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select label="Class *" value={selectedClass} onChange={(val) => setSelectedClass(val)}
            options={classes.map((c: any) => ({ value: c.id, label: `${c.name} ${c.stream || ''}` }))} />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSave} disabled={saving || !selectedClass}>
              <Save className="mr-2 h-4 w-4" /> {saving ? 'Saving...' : 'Save Attendance'}
            </Button>
          </div>
        </div>

        {selectedClass && (
          <div className="mb-4 flex flex-wrap gap-4 text-sm">
            <span className="text-green-600">Present: {stats.present}</span>
            <span className="text-red-600">Absent: {stats.absent}</span>
            <span className="text-yellow-600">Late: {stats.late}</span>
            <span className="text-blue-600">Sick: {stats.sick}</span>
            <span className="text-gray-600">Excused: {stats.excused}</span>
          </div>
        )}

        {loading && <div className="flex h-32 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>}

        {!loading && selectedClass && pupils.length > 0 && (
          <Table>
            <TableHeader><TableRow><TableHead>No.</TableHead><TableHead>Name</TableHead><TableHead>Adm No.</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {pupils.map((p, i) => (
                <TableRow key={p.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-medium">{p.firstName} {p.lastName}</TableCell>
                  <TableCell><span className="font-mono text-xs">{p.admissionNumber}</span></TableCell>
                  <TableCell>
                    <select value={records[p.id] || 'PRESENT'} onChange={e => setRecords(prev => ({ ...prev, [p.id]: e.target.value }))}
                      className="rounded-lg border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                      {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}