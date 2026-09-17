'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/lib/utils'
import { ArrowLeft, Printer } from 'lucide-react'

export default function ReceiptPage() {
  const params = useParams()
  const router = useRouter()
  const [payment, setPayment] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/fees/payments/${params.id}`).then(r => r.json()).then(d => setPayment(d.payment)).finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
  if (!payment) return <div className="py-12 text-center text-gray-500">Payment not found</div>

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Receipt</h1>
        <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print</Button>
      </div>
      <Card className="no-print-border">
        <div className="text-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold">School Fee Receipt</h2>
          <p className="text-sm text-gray-500">Primary School Management System</p>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Receipt No:</span><span className="font-bold font-mono">{payment.receiptNumber}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Date:</span><span>{formatDate(payment.paymentDate)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Pupil:</span><span className="font-medium">{payment.pupil?.firstName} {payment.pupil?.lastName}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Adm No:</span><span>{payment.pupil?.admissionNumber}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Class:</span><span>{payment.pupil?.class?.name}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Term:</span><span>{payment.term?.name} {payment.academicYear?.name}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Payment Method:</span><span>{payment.paymentMethod}</span></div>
          <div className="flex justify-between border-t pt-3 text-lg"><span className="font-bold">Amount Paid:</span><span className="font-bold text-green-600">{formatCurrency(payment.amount)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Received by:</span><span>{payment.receivedBy?.name}</span></div>
        </div>
        <div className="mt-8 border-t pt-4">
          <div className="flex justify-between text-xs text-gray-400">
            <div className="text-center w-32"><div className="border-b mb-1">&nbsp;</div>Signature</div>
            <div className="text-center w-32"><div className="border-b mb-1">&nbsp;</div>Date</div>
          </div>
        </div>
      </Card>
    </div>
  )
}