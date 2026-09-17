'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardCheck,
  DollarSign, FileText, Megaphone, Settings, ChevronDown, ChevronRight,
  UserCheck, Award, BarChart3, Database, ArrowUpCircle, Menu, X,
  School, User, LogOut
} from 'lucide-react'

interface SidebarProps {
  role: string
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  label: string
  href: string
  icon: any
  roles?: string[]
  children?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    label: 'Pupils',
    href: '/pupils',
    icon: Users,
    roles: ['SUPER_ADMIN', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER', 'TEACHER', 'CLASS_TEACHER', 'BURSAR'],
    children: [
      { label: 'All Pupils', href: '/pupils' },
      { label: 'Register Pupil', href: '/pupils/new' },
    ],
  },
  {
    label: 'Classes',
    href: '/classes',
    icon: School,
    roles: ['SUPER_ADMIN', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER'],
    children: [
      { label: 'All Classes', href: '/classes' },
      { label: 'Add Class', href: '/classes/new' },
    ],
  },
  {
    label: 'Teachers',
    href: '/teachers',
    icon: GraduationCap,
    roles: ['SUPER_ADMIN', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER'],
    children: [
      { label: 'All Teachers', href: '/teachers' },
      { label: 'Add Teacher', href: '/teachers/new' },
    ],
  },
  {
    label: 'Subjects',
    href: '/subjects',
    icon: BookOpen,
    roles: ['SUPER_ADMIN', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER', 'TEACHER', 'CLASS_TEACHER'],
  },
  {
    label: 'Attendance',
    href: '/attendance',
    icon: ClipboardCheck,
    roles: ['SUPER_ADMIN', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER', 'TEACHER', 'CLASS_TEACHER'],
  },
  {
    label: 'School Fees',
    href: '/fees',
    icon: DollarSign,
    roles: ['SUPER_ADMIN', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER', 'BURSAR'],
    children: [
      { label: 'Fee Structure', href: '/fees/structure' },
      { label: 'Payments', href: '/fees/payments' },
      { label: 'New Payment', href: '/fees/payments/new' },
    ],
  },
  {
    label: 'Marks & Exams',
    href: '/marks',
    icon: Award,
    roles: ['SUPER_ADMIN', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER', 'TEACHER', 'CLASS_TEACHER'],
    children: [
      { label: 'Enter Marks', href: '/marks' },
      { label: 'Examinations', href: '/marks/examinations' },
    ],
  },
  {
    label: 'Report Cards',
    href: '/report-cards',
    icon: FileText,
    roles: ['SUPER_ADMIN', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER', 'TEACHER', 'CLASS_TEACHER'],
  },
  {
    label: 'Parents',
    href: '/parents',
    icon: UserCheck,
    roles: ['SUPER_ADMIN', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER'],
    children: [
      { label: 'All Parents', href: '/parents' },
      { label: 'Add Parent', href: '/parents/new' },
    ],
  },
  {
    label: 'Announcements',
    href: '/announcements',
    icon: Megaphone,
    roles: ['SUPER_ADMIN', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER', 'TEACHER', 'CLASS_TEACHER', 'BURSAR', 'PARENT'],
  },
  {
    label: 'Promotions',
    href: '/promotions',
    icon: ArrowUpCircle,
    roles: ['SUPER_ADMIN', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER'],
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: BarChart3,
    roles: ['SUPER_ADMIN', 'HEAD_TEACHER', 'DEPUTY_HEAD_TEACHER', 'BURSAR'],
  },
  {
    label: 'User Management',
    href: '/users',
    icon: User,
    roles: ['SUPER_ADMIN'],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['SUPER_ADMIN', 'HEAD_TEACHER'],
  },
  {
    label: 'Backup',
    href: '/backup',
    icon: Database,
    roles: ['SUPER_ADMIN'],
  },
]

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<string[]>([])

  const toggleExpand = (label: string) => {
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  const filteredItems = navItems.filter((item) => {
    if (!item.roles) return true
    if (item.roles.includes('SUPER_ADMIN') && role === 'SUPER_ADMIN') return true
    return item.roles.includes(role)
  })

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside className={cn(
        'fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700 transition-transform lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">PS</div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">PSMS</span>
          </Link>
          <button onClick={onClose} className="lg:hidden rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-3">
          <ul className="space-y-1">
            {filteredItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const hasChildren = item.children && item.children.length > 0
              const isExpanded = expanded.includes(item.label)

              return (
                <li key={item.label}>
                  {hasChildren ? (
                    <>
                      <button
                        onClick={() => toggleExpand(item.label)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                      {isExpanded && (
                        <ul className="mt-1 ml-8 space-y-1">
                          {item.children!.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={onClose}
                                className={cn(
                                  'block rounded-lg px-3 py-2 text-sm transition-colors',
                                  pathname === child.href
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                                )}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
