'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import { Plus, Eye, Printer } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    fetch(`/api/fees/payments?page=${page}&limit=20`)
      .then(r => r.json())
      .then(d => { setPayments(d.payments || []); setTotalPages(d.pages || 1) })
      .finally(() => setLoading(false))
  }, [page])

  const viewReceipt = (id: string) => {
    router.push(`/fees/payments/${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Payments</h1>
        <Link href="/fees/payments/new"><Button><Plus className="mr-2 h-4 w-4" /> New Payment</Button></Link>
      </div>
      <Card>
        {loading ? (
          <div className="flex h-32 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
        ) : (
          <>
            <Table>
              <TableHeader><TableRow><TableHead>Receipt</TableHead><TableHead>Pupil</TableHead><TableHead>Class</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {payments.map(p => (
                  <TableRow key={p.id}>
                    <TableCell><span className="font-mono text-xs font-bold">{p.receiptNumber}</span></TableCell>
                    <TableCell className="font-medium">{p.pupil?.firstName} {p.pupil?.lastName}</TableCell>
                    <TableCell>{p.pupil?.class?.name}</TableCell>
                    <TableCell className="font-bold text-green-600">{formatCurrency(p.amount)}</TableCell>
                    <TableCell><Badge variant="info">{p.paymentMethod}</Badge></TableCell>
                    <TableCell>{formatDate(p.paymentDate)}</TableCell>
                    <TableCell><Button variant="ghost" size="sm" onClick={() => viewReceipt(p.id)}><Printer className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4"><Pagination page={page} pages={totalPages} onPageChange={setPage} /></div>
          </>
        )}
      </Card>
    </div>
  )
}