'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePublicClient, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { WalletButton } from '@/components/wallet-button'
import { AdminGuard } from '@/components/admin-guard'
import { Badge } from '@/components/ui/badge'
import { useScholarship } from '@/lib/hooks/use-scholarship'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'
import { ApplicationStatus } from '@/types/scholarship'
import { GraduationCap, ArrowLeft, Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { formatEther } from 'viem'

interface ApplicationEvent {
  applicant: string
  metadataURI: string
  status: ApplicationStatus
}

export default function ApplicationsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  return (
    <AdminGuard>
      <ApplicationsContent params={params} />
    </AdminGuard>
  )
}

function ApplicationsContent({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params)
  const scholarshipId = parseInt(id)
  const { scholarship, isLoading: scholarshipLoading } = useScholarship(scholarshipId)
  const [applications, setApplications] = useState<ApplicationEvent[]>([])
  const [loading, setLoading] = useState(true)
  
  const publicClient = usePublicClient()

  useEffect(() => {
    async function fetchApplications() {
      if (!publicClient) return
      
      try {
        // Fetch ApplicationSubmitted events for this scholarship
        const logs = await publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          event: {
            type: 'event',
            name: 'ApplicationSubmitted',
            inputs: [
              { type: 'uint256', indexed: true, name: 'scholarshipId' },
              { type: 'address', indexed: true, name: 'applicant' },
              { type: 'string', indexed: false, name: 'metadataURI' },
            ],
          },
          args: {
            scholarshipId: BigInt(scholarshipId),
          },
          fromBlock: 0n,
          toBlock: 'latest',
        })

        // Fetch current status for each applicant
        const applicationsWithStatus = await Promise.all(
          logs.map(async (log) => {
            const applicant = log.args.applicant as string
            const metadataURI = log.args.metadataURI as string
            
            // Read current application status from contract
            const status = await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: CONTRACT_ABI,
              functionName: 'getApplicationStatus',
              args: [BigInt(scholarshipId), applicant],
            }) as ApplicationStatus

            return {
              applicant,
              metadataURI,
              status,
            }
          })
        )

        setApplications(applicationsWithStatus)
      } catch (error) {
        console.error('[v0] Error fetching applications:', error)
        toast.error('Failed to load applications')
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [scholarshipId, publicClient])

  if (scholarshipLoading || loading) {
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
          <Link href="/admin" className="text-primary hover:underline">
            Back to Admin
          </Link>
        </div>
      </div>
    )
  }

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
                href="/admin" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
        <Link 
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-balance">
            Applications for {scholarship.title}
          </h1>
          <p className="text-muted-foreground mb-3">
            Use <strong>Approve</strong> or <strong>Reject</strong> on each application below. Approved applicants can then claim the scholarship funds.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Amount: {formatEther(scholarship.amount)} ETH</span>
            <span>•</span>
            <span>{applications.length} Total Applications</span>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center max-w-lg mx-auto">
            <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Applications Yet</h2>
            <p className="text-muted-foreground mb-6">
              Applications will appear here once someone applies for this scholarship.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              <strong>How to get applications:</strong> Share the scholarship link with students. They open it, click &quot;Apply Now&quot;, fill the form, and confirm in their wallet. Their application will then show here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/scholarships/${scholarshipId}/apply`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Apply Now
              </Link>
              <Link
                href={`/scholarships/${scholarshipId}`}
                className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:border-primary/50 transition-colors"
              >
                Open scholarship page (to test or share)
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app, index) => (
              <ApplicationItem
                key={index}
                application={app}
                scholarshipId={scholarshipId}
                onUpdate={() => {
                  // Refetch applications after action
                  window.location.reload()
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ApplicationItem({
  application,
  scholarshipId,
  onUpdate,
}: {
  application: ApplicationEvent
  scholarshipId: number
  onUpdate: () => void
}) {
  const { data: approveHash, writeContract: approve, isPending: isApproving } = useWriteContract()
  const { data: rejectHash, writeContract: reject, isPending: isRejecting } = useWriteContract()
  
  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash })
  const { isSuccess: rejectSuccess } = useWaitForTransactionReceipt({ hash: rejectHash })

  useEffect(() => {
    if (approveSuccess) {
      toast.success('Application approved!')
      onUpdate()
    }
  }, [approveSuccess, onUpdate])

  useEffect(() => {
    if (rejectSuccess) {
      toast.success('Application rejected')
      onUpdate()
    }
  }, [rejectSuccess, onUpdate])

  const handleApprove = () => {
    approve({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'approveApplication',
      args: [BigInt(scholarshipId), application.applicant as `0x${string}`],
    })
  }

  const handleReject = () => {
    reject({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'rejectApplication',
      args: [BigInt(scholarshipId), application.applicant as `0x${string}`],
    })
  }

  const isPending = application.status === ApplicationStatus.Pending

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm">
              {application.applicant.slice(0, 6)}...{application.applicant.slice(-4)}
            </span>
            <Badge 
              variant={
                application.status === ApplicationStatus.Approved ? 'default' :
                application.status === ApplicationStatus.Pending ? 'secondary' :
                'destructive'
              }
            >
              {ApplicationStatus[application.status]}
            </Badge>
          </div>
          <a
            href={application.metadataURI}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View Application Metadata
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        {isPending && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isApproving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Approve
            </button>
            <button
              onClick={handleReject}
              disabled={isApproving || isRejecting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isRejecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
