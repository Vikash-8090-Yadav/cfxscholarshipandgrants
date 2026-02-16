'use client'

import Link from 'next/link'
import { WalletButton } from '@/components/wallet-button'
import { AdminGuard } from '@/components/admin-guard'
import { useScholarshipCount } from '@/lib/hooks/use-scholarship'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'
import { formatEther } from 'viem'
import { GraduationCap, Plus, Users, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Scholarship } from '@/types/scholarship'

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  )
}

function AdminDashboard() {
  const { count, isLoading: countLoading } = useScholarshipCount()

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <GraduationCap className="w-7 h-7 text-primary" />
              <span className="text-balance">OnChain Scholarship</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                href="/scholarships" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse
              </Link>
              <Link 
                href="/admin" 
                className="text-sm font-medium text-foreground"
              >
                Admin
              </Link>
              <WalletButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-balance">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage scholarships and review applications. To approve or reject applications, click <strong>Applications</strong> next to each scholarship below.
            </p>
          </div>
          <Link
            href="/admin/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Create Scholarship
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="text-3xl font-bold text-primary mb-2">
              {countLoading ? '...' : count}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Scholarships
            </div>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="text-3xl font-bold text-primary mb-2">
              {countLoading ? '...' : count}
            </div>
            <div className="text-sm text-muted-foreground">
              Active Scholarships
            </div>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="text-3xl font-bold text-primary mb-2">
              0
            </div>
            <div className="text-sm text-muted-foreground">
              Pending Applications
            </div>
          </div>
        </div>

        {/* Scholarships List */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">All Scholarships</h2>
          
          {countLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : count === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Scholarships Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first scholarship to get started
              </p>
              <Link
                href="/admin/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Create Scholarship
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from({ length: count }, (_, i) => (
                <AdminScholarshipItem key={i} scholarshipId={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AdminScholarshipItem({ scholarshipId }: { scholarshipId: number }) {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getScholarship',
    args: [BigInt(scholarshipId)],
  })

  if (isLoading) {
    return (
      <div className="p-4 rounded-lg border border-border">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded mb-2 w-1/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (!data) return null

  const scholarship = data as Scholarship

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-semibold">{scholarship.title}</h3>
          <Badge variant={scholarship.isActive ? 'default' : 'secondary'}>
            {scholarship.isActive ? 'Active' : 'Closed'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Amount: {formatEther(scholarship.amount)} ETH
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/applications/${scholarshipId}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Users className="w-4 h-4" />
          Review / Approve or Reject
        </Link>
        <Link
          href={`/scholarships/${scholarshipId}`}
          className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:border-primary/50 transition-colors"
        >
          View
        </Link>
      </div>
    </div>
  )
}
