'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Plus, Users, Eye } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/classes').then(r => r.json()).then(d => setClasses(d.classes || [])).finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Classes</h1>
        <Link href="/classes/new"><Button><Plus className="mr-2 h-4 w-4" /> Add Class</Button></Link>
      </div>
      {loading ? (
        <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls: any) => (
            <Card key={cls.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push(`/classes/${cls.id}`)}>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg">{cls.name.replace('Primary ', 'P')}</div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{cls.name} {cls.stream}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1"><Users className="h-4 w-4" /> {cls._count.pupils} pupils</p>
                </div>
              </div>
            </Card>
          ))}
          {classes.length === 0 && <p className="col-span-full py-8 text-center text-gray-500">No classes created yet</p>}
        </div>
      )}
    </div>
  )
}
