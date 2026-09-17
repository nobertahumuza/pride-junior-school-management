'use client'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Database, Download, Upload, History } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

export default function BackupPage() {
  const { addToast } = useToast()

  const handleBackup = async () => {
    addToast('Database backup feature requires server-side MySQL access. Use the database export tool in phpMyAdmin or run: mysqldump -u root school_management > backup.sql', 'info')
  }

  const handleDownload = () => {
    addToast('Download the backup SQL file from your server.', 'info')
  }

  const handleRestore = () => {
    addToast('Restore requires uploading an SQL file. Use phpMyAdmin or: mysql -u root school_management < backup.sql', 'info')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Database Backup & Restore</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="text-center">
          <Database className="mx-auto h-12 w-12 text-blue-600" />
          <h3 className="mt-4 font-bold text-gray-900 dark:text-white">Backup Database</h3>
          <p className="mt-2 text-sm text-gray-500">Create a backup of the entire database</p>
          <Button className="mt-4" onClick={handleBackup}><Download className="mr-2 h-4 w-4" /> Create Backup</Button>
        </Card>
        <Card className="text-center">
          <Upload className="mx-auto h-12 w-12 text-green-600" />
          <h3 className="mt-4 font-bold text-gray-900 dark:text-white">Restore Database</h3>
          <p className="mt-2 text-sm text-gray-500">Restore from a previous backup file</p>
          <Button variant="success" className="mt-4" onClick={handleRestore}><Upload className="mr-2 h-4 w-4" /> Restore</Button>
        </Card>
        <Card className="text-center">
          <History className="mx-auto h-12 w-12 text-purple-600" />
          <h3 className="mt-4 font-bold text-gray-900 dark:text-white">Backup History</h3>
          <p className="mt-2 text-sm text-gray-500">View previous backups</p>
          <Button variant="outline" className="mt-4" onClick={() => addToast('No backup history available in web interface.', 'info')}><History className="mr-2 h-4 w-4" /> View History</Button>
        </Card>
      </div>
      <Card title="Backup Instructions">
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <p><strong>Using phpMyAdmin:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open phpMyAdmin in your browser</li>
            <li>Select the <code>school_management</code> database</li>
            <li>Click the <strong>Export</strong> tab</li>
            <li>Choose <strong>Quick</strong> export method</li>
            <li>Click <strong>Go</strong> to download the SQL file</li>
          </ol>
          <p className="mt-4"><strong>Using command line:</strong></p>
          <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs">mysqldump -u root school_management &gt; backup_2026.sql</code>
          <p className="mt-4"><strong>To restore:</strong></p>
          <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs">mysql -u root school_management &lt; backup_2026.sql</code>
        </div>
      </Card>
    </div>
  )
}
