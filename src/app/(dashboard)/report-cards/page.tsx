'use client'
import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Select from '@/components/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { calculateGrade, formatCurrency } from '@/lib/utils'
import { Printer, FileText } from 'lucide-react'

export default function ReportCardsPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [pupils, setPupils] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedPupil, setSelectedPupil] = useState('')
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/classes').then(r => r.json()).then(d => setClasses(d.classes || []))
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetch(`/api/pupils?classId=${selectedClass}&limit=100`).then(r => r.json()).then(d => setPupils(d.pupils || []))
    }
  }, [selectedClass])

  const generateReport = async () => {
    if (!selectedPupil) return
    setGenerating(true)
    try {
      const res = await fetch(`/api/pupils/${selectedPupil}`)
      const data = await res.json()
      setReport(data.pupil)
    } finally { setGenerating(false) }
  }

  const generateAllReports = async () => {
    if (!selectedClass) return
    setGenerating(true)
    try {
      for (const pupil of pupils) {
        const res = await fetch(`/api/pupils/${pupil.id}`)
        const data = await res.json()
        const pupilData = data.pupil
        if (!pupilData) continue

        const attendance = pupilData.attendance || []
        const presentDays = attendance.filter((a: any) => a.status === 'PRESENT' || a.status === 'LATE').length
        const totalDays = attendance.length || 1
        const marks = pupilData.marks || []
        const subjects = marks.reduce((acc: any, m: any) => {
          if (!acc[m.subjectId]) {
            acc[m.subjectId] = { subject: m.subject?.name, scores: [] }
          }
          acc[m.subjectId].scores.push(m.score / m.maxScore * 100)
          return acc
        }, {})

        const subjectRows = Object.values(subjects).map((s: any) => {
          const avg = s.scores.reduce((a: number, b: number) => a + b, 0) / s.scores.length
          return { subject: s.subject, avg, ...calculateGrade(avg, 100) }
        })

        const overallAvg = subjectRows.length > 0 ? subjectRows.reduce((a: number, b: any) => a + b.avg, 0) / subjectRows.length : 0
        const overallGrade = calculateGrade(overallAvg, 100)

        printReportCard({
          name: `${pupilData.firstName} ${pupilData.middleName || ''} ${pupilData.lastName}`.trim(),
          admissionNumber: pupilData.admissionNumber,
          className: `${pupilData.class?.name} ${pupilData.class?.stream || ''}`,
          subjects: subjectRows,
          totalAvg: overallAvg,
          overallGrade: overallGrade,
          daysPresent: presentDays,
          daysAbsent: totalDays - presentDays,
          totalDays,
          attendancePct: Math.round((presentDays / totalDays) * 100),
        })
      }
    } finally { setGenerating(false) }
  }

  const printReportCard = (data: any) => {
    const content = `
    <!DOCTYPE html>
    <html><head>
      <title>Report Card - ${data.name}</title>
      <style>
        body { font-family: 'Times New Roman', serif; margin: 0; padding: 20px; color: #000; }
        .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 15px; }
        .header h1 { margin: 0; font-size: 18px; text-transform: uppercase; }
        .header h2 { margin: 2px 0; font-size: 14px; }
        .header p { margin: 2px 0; font-size: 11px; }
        .info { margin: 10px 0; font-size: 12px; }
        .info table { width: 100%; }
        .info td { padding: 2px 8px; }
        .results { margin: 15px 0; }
        .results table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .results th, .results td { border: 1px solid #000; padding: 6px 8px; text-align: left; }
        .results th { background: #f0f0f0; font-weight: bold; }
        .summary { margin: 10px 0; font-size: 12px; display: flex; gap: 30px; }
        .comments { margin: 15px 0; font-size: 12px; }
        .comments div { border: 1px solid #000; padding: 8px; margin: 8px 0; min-height: 40px; }
        .comments label { font-weight: bold; display: block; margin-bottom: 4px; }
        .signatures { margin-top: 30px; display: flex; justify-content: space-between; font-size: 11px; }
        .signatures div { width: 30%; text-align: center; }
        .signatures .line { border-top: 1px solid #000; margin-top: 40px; padding-top: 4px; }
      </style>
    </head><body>
      <div class="header">
        <h1>PRIDE JUNIOR SCHOOL</h1>
        <p>P.O. Box XXXX, Uganda | Tel: XXXX-XXXXXX</p>
        <p>"Excellence in Education"</p>
        <h2>TERMINAL REPORT</h2>
      </div>
      <div class="info"><table>
        <tr><td><strong>Name:</strong> ${data.name}</td><td><strong>Class:</strong> ${data.className}</td></tr>
        <tr><td><strong>Adm No:</strong> ${data.admissionNumber}</td><td><strong>Term:</strong> Current Term</td></tr>
        <tr><td><strong>Academic Year:</strong> 2026</td><td><strong>Date:</strong> ${new Date().toLocaleDateString()}</td></tr>
      </table></div>
      <div class="results"><table>
        <thead><tr><th>Subject</th><th>Average %</th><th>Grade</th><th>Remark</th></tr></thead>
        <tbody>
          ${data.subjects.map((s: any) => `<tr><td>${s.subject}</td><td>${s.avg.toFixed(1)}%</td><td>${s.grade}</td><td>${s.remark}</td></tr>`).join('')}
        </tbody>
      </table></div>
      <div class="summary">
        <div><strong>Overall Average:</strong> ${data.totalAvg.toFixed(1)}%</div>
        <div><strong>Overall Grade:</strong> ${data.overallGrade.grade}</div>
        <div><strong>Attendance:</strong> ${data.attendancePct}%</div>
        <div><strong>Days Present:</strong> ${data.daysPresent}/${data.totalDays}</div>
      </div>
      <div class="comments">
        <div><label>Class Teacher's Comment:</label></div>
        <div><label>Head Teacher's Comment:</label></div>
      </div>
      <div style="margin-top:10px;font-size:12px"><strong>Next Term Begins:</strong> ___________ &nbsp;&nbsp; <strong>Next Term Ends:</strong> ___________</div>
      <div class="signatures">
        <div><div class="line">Class Teacher's Signature</div></div>
        <div><div class="line">Head Teacher's Signature</div></div>
        <div><div class="line">School Stamp</div></div>
      </div>
    </body></html>`

    const w = window.open('', '_blank')
    if (w) {
      w.document.write(content)
      w.document.close()
    }
  }

  const handlePrintSelected = () => {
    if (!report) return
    const attendance = report.attendance || []
    const presentDays = attendance.filter((a: any) => a.status === 'PRESENT' || a.status === 'LATE').length
    const totalDays = attendance.length || 1
    const marks = report.marks || []

    const subjectMap: Record<string, { name: string; scores: number[] }> = {}
    marks.forEach((m: any) => {
      if (!subjectMap[m.subjectId]) subjectMap[m.subjectId] = { name: m.subject?.name || 'Unknown', scores: [] }
      subjectMap[m.subjectId].scores.push((m.score / m.maxScore) * 100)
    })

    const subjectRows = Object.values(subjectMap).map(s => {
      const avg = s.scores.reduce((a: number, b: number) => a + b, 0) / s.scores.length
      return { subject: s.name, avg, ...calculateGrade(avg, 100) }
    })

    const overallAvg = subjectRows.length > 0 ? subjectRows.reduce((a: number, b: any) => a + b.avg, 0) / subjectRows.length : 0

    printReportCard({
      name: `${report.firstName} ${report.middleName || ''} ${report.lastName}`.trim(),
      admissionNumber: report.admissionNumber,
      className: `${report.class?.name} ${report.class?.stream || ''}`,
      subjects: subjectRows,
      totalAvg: overallAvg,
      overallGrade: calculateGrade(overallAvg, 100),
      daysPresent: presentDays,
      daysAbsent: totalDays - presentDays,
      totalDays,
      attendancePct: Math.round((presentDays / totalDays) * 100),
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Report Cards</h1>
      <Card title="Generate Report Card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Select label="Class" value={selectedClass} onChange={(val) => { setSelectedClass(val); setSelectedPupil(''); setReport(null) }}
            options={classes.map((c: any) => ({ value: c.id, label: `${c.name} ${c.stream || ''}` }))} />
          <Select label="Pupil" value={selectedPupil} onChange={setSelectedPupil}
            options={pupils.map((p: any) => ({ value: p.id, label: `${p.firstName} ${p.lastName}` }))} />
          <div className="flex items-end gap-2">
            <Button onClick={generateReport} disabled={!selectedPupil || generating}>
              <FileText className="mr-2 h-4 w-4" /> Generate
            </Button>
            <Button variant="outline" onClick={handlePrintSelected} disabled={!report}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
          </div>
          <div className="flex items-end">
            <Button variant="success" onClick={generateAllReports} disabled={!selectedClass || generating}>
              {generating ? 'Generating...' : 'Print All Class Reports'}
            </Button>
          </div>
        </div>
      </Card>

      {report && (
        <div ref={printRef}>
          <Card>
            <div className="text-center border-b-2 border-double pb-3 mb-4">
              <h2 className="text-lg font-bold uppercase">Pride Junior School</h2>
              <p className="text-sm text-gray-500">Terminal Report Card</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div><strong>Name:</strong> {report.firstName} {report.middleName} {report.lastName}</div>
              <div><strong>Class:</strong> {report.class?.name} {report.class?.stream}</div>
              <div><strong>Adm No:</strong> {report.admissionNumber}</div>
              <div><strong>Gender:</strong> {report.gender}</div>
            </div>
            {report.marks?.length > 0 && (
              <Table>
                <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Average %</TableHead><TableHead>Grade</TableHead><TableHead>Remark</TableHead></TableRow></TableHeader>
                <TableBody>
                  {(() => {
                    const subjectMap: Record<string, { name: string; scores: number[] }> = {}
                    report.marks.forEach((m: any) => {
                      if (!subjectMap[m.subjectId]) subjectMap[m.subjectId] = { name: m.subject?.name, scores: [] }
                      subjectMap[m.subjectId].scores.push((m.score / m.maxScore) * 100)
                    })
                    return Object.values(subjectMap).map((s, i) => {
                      const avg = s.scores.reduce((a: number, b: number) => a + b, 0) / s.scores.length
                      const g = calculateGrade(avg, 100)
                      return (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{s.name}</TableCell>
                          <TableCell>{avg.toFixed(1)}%</TableCell>
                          <TableCell><Badge variant={g.grade === 'A' || g.grade === 'B' ? 'success' : g.grade === 'C' ? 'info' : 'warning'}>{g.grade}</Badge></TableCell>
                          <TableCell>{g.remark}</TableCell>
                        </TableRow>
                      )
                    })
                  })()}
                </TableBody>
              </Table>
            )}
            {report.marks?.length === 0 && <p className="py-4 text-center text-sm text-gray-500">No marks recorded for this pupil</p>}
          </Card>
        </div>
      )}
    </div>
  )
}
