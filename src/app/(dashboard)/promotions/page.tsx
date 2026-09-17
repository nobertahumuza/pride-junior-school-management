'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Select from '@/components/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { ArrowUpCircle } from 'lucide-react'
import { CLASSES } from '@/lib/utils'

export default function PromotionsPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [pupils, setPupils] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [promotions, setPromotions] = useState<Record<string, { action: string; toClass: string }>>({})
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    fetch('/api/classes').then(r => r.json()).then(d => setClasses(d.classes || []))
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetch(`/api/pupils?classId=${selectedClass}&limit=100`).then(r => r.json()).then(d => setPupils(d.pupils || []))
    }
  }, [selectedClass])

  const getClassIndex = (name: string) => CLASSES.indexOf(name)

  const handlePromote = async () => {
    setSaving(true)
    try {
      for (const [pupilId, promo] of Object.entries(promotions)) {
        if (promo.action === 'promote' && promo.toClass) {
          const pupil = pupils.find(p => p.id === pupilId)
          if (pupil) {
            const newClass = classes.find(c => c.name === promo.toClass)
            if (newClass) {
              await fetch(`/api/pupils/${pupilId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classId: newClass.id }),
              })
            }
          }
        }
      }
      addToast('Promotions processed successfully!')
    } catch { addToast('Failed to process promotions', 'error') }
    finally { setSaving(false) }
  }

  const currentIdx = classes.find(c => c.id === selectedClass)?.name ? getClassIndex(classes.find(c => c.id === selectedClass)?.name) : -1
  const nextClass = currentIdx >= 0 && currentIdx < CLASSES.length - 1 ? CLASSES[currentIdx + 1] : null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pupil Promotions</h1>
      <Card>
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Select Class to Promote" value={selectedClass} onChange={setSelectedClass}
            options={classes.map((c: any) => ({ value: c.id, label: `${c.name} ${c.stream || ''}` }))} />
          {nextClass && (
            <Button onClick={handlePromote} disabled={saving || Object.keys(promotions).length === 0} variant="success" className="self-end">
              <ArrowUpCircle className="mr-2 h-4 w-4" /> {saving ? 'Processing...' : `Promote to ${nextClass}`}
            </Button>
          )}
        </div>
        {pupils.length > 0 && (
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Adm No</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
            <TableBody>
              {pupils.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.firstName} {p.lastName}</TableCell>
                  <TableCell><span className="font-mono text-xs">{p.admissionNumber}</span></TableCell>
                  <TableCell>
                    <select
                      value={promotions[p.id]?.action || ''}
                      onChange={e => setPromotions(prev => ({
                        ...prev,
                        [p.id]: { action: e.target.value, toClass: nextClass || '' }
                      }))}
                      className="rounded-lg border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Select...</option>
                      <option value="promote">Promote</option>
                      <option value="repeat">Repeat</option>
                      <option value="transfer">Transfer</option>
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
