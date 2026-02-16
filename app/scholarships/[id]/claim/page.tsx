'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatEther } from 'viem'
import { WalletButton } from '@/components/wallet-button'
import { useScholarship } from '@/lib/hooks/use-scholarship'
import { useApplicationStatus } from '@/lib/hooks/use-application'
import { ApplicationStatus } from '@/types/scholarship'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'
import { GraduationCap, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ClaimPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params)
  const scholarshipId = parseInt(id)
  const router = useRouter()
  const { scholarship, isLoading: scholarshipLoading } = useScholarship(scholarshipId)
  const { status } = useApplicationStatus(scholarshipId)

  const { data: hash, writeContract, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleClaim = async () => {
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'claimFunds',
        args: [BigInt(scholarshipId)],
      })
    } catch (error) {
      console.error('[v0] Claim funds error:', error)
      toast.error('Failed to claim funds')
    }
  }

  if (isSuccess) {
    toast.success('Funds claimed successfully!')
    setTimeout(() => {
      router.push(`/scholarships/${scholarshipId}`)
    }, 2000)
  }

  if (scholarshipLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!scholarship || status !== ApplicationStatus.Approved || scholarship.amount === 0n) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Unable to Claim</h2>
          <p className="text-muted-foreground mb-4">
            Your application must be approved and funds must be available
          </p>
          <Link href={`/scholarships/${scholarshipId}`} className="text-primary hover:underline">
            Back to Scholarship
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
            <WalletButton />
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href={`/scholarships/${scholarshipId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Scholarship
        </Link>

        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-3xl font-bold mb-2 text-balance">
            Congratulations!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your scholarship application has been approved
          </p>

          <div className="bg-secondary/50 rounded-lg p-6 mb-8">
            <div className="text-sm text-muted-foreground mb-2">
              Scholarship Amount
            </div>
            <div className="text-4xl font-bold text-primary">
              {formatEther(scholarship.amount)} ETH
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold mb-2 text-sm">What happens next?</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex gap-2">
                <span>•</span>
                <span>Click the button below to claim your scholarship funds</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Confirm the transaction in your wallet</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Funds will be transferred directly to your wallet</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleClaim}
            disabled={isPending || isConfirming || isSuccess}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isPending ? 'Confirm in Wallet...' : 'Claiming...'}
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Claimed Successfully!
              </>
            ) : (
              'Claim Your Scholarship'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
