'use client'
import { useState, useEffect } from 'react'
import { StatCard } from '@/components/ui/card'
import { Card } from '@/components/ui/card'
import { Users, GraduationCap, School, ClipboardCheck, DollarSign, AlertCircle, Megaphone, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  const genderData = [
    { name: 'Male', value: data.malePupils },
    { name: 'Female', value: data.femalePupils },
  ]

  const classData = data.classDistribution?.map((c: any) => ({
    name: c.name,
    students: c._count.pupils,
  })) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {data.currentYear} - {data.currentTerm}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Pupils" value={data.totalPupils} icon={<Users className="h-6 w-6" />} color="blue" />
        <StatCard title="Total Teachers" value={data.totalTeachers} icon={<GraduationCap className="h-6 w-6" />} color="green" />
        <StatCard title="Total Classes" value={data.totalClasses} icon={<School className="h-6 w-6" />} color="purple" />
        <StatCard title="Today's Attendance" value={data.todayAttendance} icon={<ClipboardCheck className="h-6 w-6" />} color="green" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Absent Today" value={data.absentToday} icon={<AlertCircle className="h-6 w-6" />} color="red" />
        <StatCard title="Fees Collected" value={`UGX ${(data.feesPaid || 0).toLocaleString()}`} icon={<DollarSign className="h-6 w-6" />} color="green" />
        <StatCard title="Outstanding Fees" value={`UGX ${(data.outstandingFees || 0).toLocaleString()}`} icon={<DollarSign className="h-6 w-6" />} color="yellow" />
        <StatCard title="Male / Female" value={`${data.malePupils} / ${data.femalePupils}`} icon={<Users className="h-6 w-6" />} color="blue" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Pupils by Class">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} tick={{ fill: '#6B7280' }} />
                <YAxis fontSize={12} tick={{ fill: '#6B7280' }} />
                <Tooltip />
                <Bar dataKey="students" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Gender Distribution">
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {genderData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Recent Announcements">
        {data.announcements?.length > 0 ? (
          <div className="space-y-3">
            {data.announcements.map((a: any) => (
              <div key={a.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">{a.title}</h4>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    a.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                    a.priority === 'LOW' ? 'bg-gray-100 text-gray-600' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {a.priority}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{a.content}</p>
                <p className="mt-2 text-xs text-gray-400">By {a.author?.name} - {formatDate(a.createdAt)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No announcements yet</p>
        )}
      </Card>
    </div>
  )
}
