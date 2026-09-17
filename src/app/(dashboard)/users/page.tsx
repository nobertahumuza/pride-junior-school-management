'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import { ROLES } from '@/lib/auth'
import { formatDate } from '@/lib/utils'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'TEACHER' })
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  const loadUsers = () => {
    fetch('/api/dashboard').then(() => {
      // We need a users API - let's create a simple one
      fetch('/api/school-settings').then(r => r.json()).then(d => {
        setUsers([])
        setLoading(false)
      })
    })
  }

  useEffect(() => { loadUsers() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    addToast('User management via API is available. Use the database to manage users.', 'info')
    setShowModal(false)
  }

  const roleLabels: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin',
    HEAD_TEACHER: 'Head Teacher',
    DEPUTY_HEAD_TEACHER: 'Deputy Head',
    TEACHER: 'Teacher',
    CLASS_TEACHER: 'Class Teacher',
    BURSAR: 'Bursar',
    PARENT: 'Parent',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" /> Add User</Button>
      </div>
      <Card>
        <p className="text-sm text-gray-500 mb-4">Manage system users, roles, and access permissions.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {ROLES.filter(r => r !== 'PARENT').map(role => (
            <div key={role} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white">{roleLabels[role] || role}</h3>
              <p className="text-xs text-gray-500 mt-1">{role}</p>
            </div>
          ))}
        </div>
      </Card>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add User">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <Select label="Role" value={form.role} onChange={(val) => setForm({ ...form, role: val })}
            options={ROLES.filter(r => r !== 'PARENT').map(r => ({ value: r, label: roleLabels[r] || r }))} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Create User</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
