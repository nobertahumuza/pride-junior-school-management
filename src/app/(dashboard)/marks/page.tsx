'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Select from '@/components/ui/select'
import Input from '@/components/ui/input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { useToast } from '@/components/ui/toast'
import { Save } from 'lucide-react'

export default function MarksPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [exams, setExams] = useState<any[]>([])
  const [pupils, setPupils] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedExam, setSelectedExam] = useState('')
  const [marks, setMarks] = useState<Record<string, string>>({})
  const [existing, setExisting] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    fetch('/api/classes').then(r => r.json()).then(d => setClasses(d.classes || []))
    fetch('/api/subjects').then(r => r.json()).then(d => setSubjects(d.subjects || []))
    fetch('/api/examinations').then(r => r.json()).then(d => setExams(d.exams || []))
  }, [])

  useEffect(() => {
    if (selectedClass) {
      setLoading(true)
      fetch(`/api/pupils?classId=${selectedClass}&limit=100`)
        .then(r => r.json())
        .then(d => setPupils(d.pupils || []))
        .finally(() => setLoading(false))
    }
  }, [selectedClass])

  useEffect(() => {
    if (selectedClass && selectedSubject && selectedExam) {
      const params = new URLSearchParams({ classId: selectedClass, subjectId: selectedSubject, examinationId: selectedExam })
      fetch(`/api/marks?${params}`)
        .then(r => r.json())
        .then(d => {
          setExisting(d.marks || [])
          const initial: Record<string, string> = {}
          d.marks.forEach((m: any) => { initial[m.pupilId] = String(m.score) })
          setMarks(initial)
        })
    }
  }, [selectedClass, selectedSubject, selectedExam])

  const exam = exams.find((e: any) => e.id === selectedExam)
  const maxMarks = exam?.maxMarks || 100

  const handleSave = async () => {
    if (!selectedClass || !selectedSubject || !selectedExam) return
    setSaving(true)
    try {
      const marksToSave = pupils
        .filter(p => marks[p.id] !== undefined && marks[p.id] !== '')
        .map(p => ({
          pupilId: p.id,
          classId: selectedClass,
          subjectId: selectedSubject,
          examinationId: selectedExam,
          score: parseFloat(marks[p.id]),
          maxScore: maxMarks,
        }))

      const res = await fetch('/api/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marks: marksToSave }),
      })
      if (!res.ok) throw new Error('Failed')
      addToast('Marks saved successfully!')
    } catch { addToast('Failed to save marks', 'error') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enter Marks</h1>
      <Card>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Select label="Class *" value={selectedClass} onChange={(val) => { setSelectedClass(val); setMarks({}); setExisting([]) }}
            options={classes.map((c: any) => ({ value: c.id, label: `${c.name} ${c.stream || ''}` }))} />
          <Select label="Subject *" value={selectedSubject} onChange={(val) => { setSelectedSubject(val); setMarks({}); setExisting([]) }}
            options={subjects.map((s: any) => ({ value: s.id, label: s.name }))} />
          <Select label="Examination *" value={selectedExam} onChange={(val) => { setSelectedExam(val); setMarks({}); setExisting([]) }}
            options={exams.map((e: any) => ({ value: e.id, label: `${e.name} (${e.maxMarks})` }))} />
          <div className="flex items-end">
            <Button onClick={handleSave} disabled={saving || !selectedClass || !selectedSubject || !selectedExam}>
              <Save className="mr-2 h-4 w-4" /> {saving ? 'Saving...' : 'Save Marks'}
            </Button>
          </div>
        </div>

        {selectedExam && (
          <p className="mb-4 text-sm text-gray-500">Maximum marks: <strong>{maxMarks}</strong></p>
        )}

        {loading && <div className="flex h-32 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>}

        {!loading && pupils.length > 0 && selectedClass && (
          <Table>
            <TableHeader><TableRow><TableHead>No.</TableHead><TableHead>Name</TableHead><TableHead>Score ({maxMarks})</TableHead><TableHead>Percentage</TableHead></TableRow></TableHeader>
            <TableBody>
              {pupils.map((p, i) => {
                const score = parseFloat(marks[p.id] || '0')
                const pct = maxMarks > 0 ? Math.round((score / maxMarks) * 100) : 0
                return (
                  <TableRow key={p.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{p.firstName} {p.lastName}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max={maxMarks}
                        value={marks[p.id] || ''}
                        onChange={e => {
                          const val = e.target.value
                          if (val === '' || (parseFloat(val) >= 0 && parseFloat(val) <= maxMarks)) {
                            setMarks(prev => ({ ...prev, [p.id]: val }))
                          }
                        }}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className={pct >= 70 ? 'text-green-600 font-bold' : pct >= 50 ? 'text-yellow-600' : 'text-red-600'}>
                      {marks[p.id] ? `${pct}%` : '-'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
