import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('min-w-full divide-y divide-gray-200 dark:divide-gray-700', className)}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children }: { children: ReactNode }) {
  return <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">{children}</tbody>
}

export function TableRow({ children, className }: { children: ReactNode; className?: string }) {
  return <tr className={cn('hover:bg-gray-50 dark:hover:bg-gray-800', className)}>{children}</tr>
}

export function TableHead({ children, className }: { children: ReactNode; className?: string }) {
  return <th className={cn('px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400', className)}>{children}</th>
}

export function TableCell({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn('whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100', className)}>{children}</td>
}
