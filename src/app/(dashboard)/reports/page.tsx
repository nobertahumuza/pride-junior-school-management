'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Select from '@/components/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { BarChart3, FileText, Download } from 'lucide-react'

export default function ReportsPage() {
  const [reportType, setReportType] = useState('')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState('')

  useEffect(() => {
    fetch('/api/classes').then(r => r.json()).then(d => setClasses(d.classes || []))
  }, [])

  const loadReport = async () => {
    if (!reportType) return
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedClass) params.set('classId', selectedClass)
      const res = await fetch(`/api/reports/${reportType}?${params}`)
      const d = await res.json()
      setData(d.report || [])
    } catch { setData([]) }
    finally { setLoading(false) }
  }

  const exportToCSV = () => {
    if (data.length === 0) return
    const headers = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object')
    const csv = [headers.join(','), ...data.map(row => headers.map(h => String(row[h] || '')).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportType}_report.csv`
    a.click()
  }

  const reportTypes = [
    { value: 'pupils', label: 'Pupil Enrollment Report' },
    { value: 'attendance', label: 'Attendance Report' },
    { value: 'fees', label: 'Fees Collection Report' },
    { value: 'academic', label: 'Academic Performance Report' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
      <Card>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select label="Report Type" value={reportType} onChange={setReportType} options={reportTypes} />
          <Select label="Class (Optional)" value={selectedClass} onChange={setSelectedClass}
            options={classes.map((c: any) => ({ value: c.id, label: `${c.name} ${c.stream || ''}` }))} />
          <div className="flex items-end gap-2">
            <Button onClick={loadReport} disabled={!reportType || loading}>
              <BarChart3 className="mr-2 h-4 w-4" /> {loading ? 'Loading...' : 'Generate'}
            </Button>
            {data.length > 0 && (
              <Button variant="outline" onClick={exportToCSV}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
            )}
          </div>
        </div>
        {loading && <div className="flex h-32 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>}
        {!loading && data.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object').map(key => (
                  <TableHead key={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 100).map((row, i) => (
                <TableRow key={i}>
                  {Object.keys(row).filter(k => typeof row[k] !== 'object').map(key => (
                    <TableCell key={key}>{String(row[key] || '')}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!loading && reportType && data.length === 0 && <p className="py-8 text-center text-gray-500">No data available for this report</p>}
      </Card>
    </div>
  )
}
