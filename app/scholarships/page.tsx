'use client'

import Link from 'next/link'
import { WalletButton } from '@/components/wallet-button'
import { ScholarshipCard } from '@/components/scholarship-card'
import { useScholarshipCount } from '@/lib/hooks/use-scholarship'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'
import { GraduationCap, Loader2 } from 'lucide-react'
import type { Scholarship } from '@/types/scholarship'

export default function ScholarshipsPage() {
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
                className="text-sm font-medium text-foreground"
              >
                Browse
              </Link>
              <WalletButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-balance">
            Available Scholarships
          </h1>
          <p className="text-muted-foreground text-pretty">
            Explore blockchain-based educational funding opportunities.
          </p>
        </div>

        {countLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : count === 0 ? (
          <div className="text-center py-24">
            <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Scholarships Yet</h2>
            <p className="text-muted-foreground">
              Check back soon for new funding opportunities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }, (_, i) => (
              <ScholarshipItem key={i} scholarshipId={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ScholarshipItem({ scholarshipId }: { scholarshipId: number }) {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getScholarship',
    args: [BigInt(scholarshipId)],
  })

  if (isLoading) {
    return (
      <div className="p-6 rounded-lg border border-border bg-card">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded mb-3" />
          <div className="h-4 bg-muted rounded mb-2" />
          <div className="h-4 bg-muted rounded w-3/4" />
        </div>
      </div>
    )
  }

  if (!data) return null

  const scholarship = data as Scholarship

  return <ScholarshipCard scholarship={scholarship} />
}
