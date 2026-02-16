'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { WalletButton } from '@/components/wallet-button'
import { useScholarship } from '@/lib/hooks/use-scholarship'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'
import { GraduationCap, ArrowLeft, Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'

export default function ApplyPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params)
  const scholarshipId = parseInt(id)
  const router = useRouter()
  const { scholarship, isLoading: scholarshipLoading } = useScholarship(scholarshipId)
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [essay, setEssay] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const { data: hash, writeContract, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !essay) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setIsUploading(true)
      
      // Create metadata object
      const metadata = {
        applicantName: name,
        email,
        essay,
        timestamp: Date.now(),
      }
      
      // In production, upload to IPFS via Pinata
      // For MVP, we'll use a simple JSON string as the URI
      const metadataURI = `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`
      
      setIsUploading(false)
      
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'submitApplication',
        args: [BigInt(scholarshipId), metadataURI],
      })
    } catch (error) {
      console.error('[v0] Submit application error:', error)
      toast.error('Failed to submit application')
      setIsUploading(false)
    }
  }

  if (isSuccess) {
    toast.success('Application submitted successfully!')
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

  if (!scholarship || !scholarship.isActive) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Scholarship Not Available</h2>
          <Link href="/scholarships" className="text-primary hover:underline">
            Back to Scholarships
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

        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-balance">
            Apply for {scholarship.title}
          </h1>
          <p className="text-muted-foreground mb-8">
            Complete the application form below. All information will be stored on-chain.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="essay" className="block text-sm font-medium mb-2">
                Personal Statement
              </label>
              <textarea
                id="essay"
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                rows={8}
                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Tell us why you deserve this scholarship..."
                required
              />
              <p className="text-xs text-muted-foreground mt-2">
                Explain your academic goals, achievements, and why you need this scholarship
              </p>
            </div>

            <div className="border border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Document uploads coming soon
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                IPFS integration for transcripts and recommendations
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending || isConfirming || isSuccess || isUploading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Preparing Application...
                </>
              ) : isPending || isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isPending ? 'Confirm in Wallet...' : 'Submitting...'}
                </>
              ) : isSuccess ? (
                'Application Submitted!'
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
