'use client'

import { use } from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { WalletButton } from '@/components/wallet-button'
import { Badge } from '@/components/ui/badge'
import { useScholarship } from '@/lib/hooks/use-scholarship'
import { useApplicationStatus } from '@/lib/hooks/use-application'
import { useIsAdmin } from '@/lib/hooks/use-is-admin'
import { ApplicationStatus } from '@/types/scholarship'
import { GraduationCap, Loader2, ArrowLeft, Shield } from 'lucide-react'

export default function ScholarshipDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params)
  const scholarshipId = parseInt(id)
  const { address, isConnected } = useAccount()
  const { scholarship, isLoading } = useScholarship(scholarshipId)
  const { status } = useApplicationStatus(scholarshipId)
  const { isAdmin } = useIsAdmin()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Scholarship Not Found</h2>
          <Link href="/scholarships" className="text-primary hover:underline">
            Back to Scholarships
          </Link>
        </div>
      </div>
    )
  }

  const hasApplied = status !== undefined && status !== null
  const isApproved = status === ApplicationStatus.Approved
  const isPending = status === ApplicationStatus.Pending
  const isRejected = status === ApplicationStatus.Rejected
  const isClaimed = status === ApplicationStatus.Claimed

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
              <WalletButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href="/scholarships"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Scholarships
        </Link>

        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-balance">
                {scholarship.title}
              </h1>
              <Badge variant={scholarship.isActive ? 'default' : 'secondary'}>
                {scholarship.isActive ? 'Active' : 'Closed'}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {formatEther(scholarship.amount)} ETH
              </div>
              <div className="text-sm text-muted-foreground">Award Amount</div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-8">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {scholarship.description}
            </p>
          </div>

          {/* Application Status & Actions */}
          <div className="border-t border-border pt-6">
            {!isConnected ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Connect your wallet to apply for this scholarship
                </p>
                <WalletButton />
              </div>
            ) : !scholarship.isActive ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  This scholarship is no longer accepting applications
                </p>
              </div>
            ) : hasApplied ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <h3 className="font-semibold mb-1">Application Status</h3>
                    <p className="text-sm text-muted-foreground">
                      {isPending && 'Your application is under review'}
                      {isApproved && 'Congratulations! Your application has been approved'}
                      {isRejected && 'Your application was not approved'}
                      {isClaimed && 'You have claimed your scholarship funds'}
                    </p>
                    {isPending && (
                      <>
                        <p className="text-xs text-muted-foreground mt-1">
                          The scholarship admin will approve or reject it. You’ll see Approved or Rejected here once they do.
                        </p>
                        {isAdmin && (
                          <Link
                            href={`/admin/applications/${scholarshipId}`}
                            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                          >
                            <Shield className="w-4 h-4" />
                            I’m the admin — go to Approve / Reject
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                  <Badge 
                    variant={
                      isApproved ? 'default' : 
                      isPending ? 'secondary' : 
                      'destructive'
                    }
                  >
                    {isPending && 'Pending'}
                    {isApproved && 'Approved'}
                    {isRejected && 'Rejected'}
                    {isClaimed && 'Claimed'}
                  </Badge>
                </div>
                {isApproved && !isClaimed && scholarship.amount > 0n && (
                  <Link 
                    href={`/scholarships/${scholarshipId}/claim`}
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Claim Your Funds
                  </Link>
                )}
              </div>
            ) : (
              <Link 
                href={`/scholarships/${scholarshipId}/apply`}
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Apply Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
