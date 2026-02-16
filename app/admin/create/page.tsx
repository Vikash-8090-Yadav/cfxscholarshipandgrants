'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { WalletButton } from '@/components/wallet-button'
import { AdminGuard } from '@/components/admin-guard'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'
import { GraduationCap, ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function CreateScholarshipPage() {
  return (
    <AdminGuard>
      <CreateScholarshipForm />
    </AdminGuard>
  )
}

function CreateScholarshipForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')

  const { data: hash, writeContract, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !amount) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const amountInWei = parseEther(amount)
      
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createScholarship',
        args: [title, description],
        value: amountInWei,
      })
    } catch (error) {
      console.error('[v0] Create scholarship error:', error)
      toast.error('Failed to create scholarship')
    }
  }

  if (isSuccess) {
    toast.success('Scholarship created successfully!')
    setTimeout(() => {
      router.push('/admin')
    }, 2000)
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>

        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-balance">
            Create New Scholarship
          </h1>
          <p className="text-muted-foreground mb-8">
            Fund a new scholarship opportunity on the blockchain
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Scholarship Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g., Computer Science Excellence Award"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Describe the scholarship, eligibility criteria, and requirements..."
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-2">
                Funding Amount (ETH)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.001"
                min="0"
                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="0.1"
                required
              />
              <p className="text-xs text-muted-foreground mt-2">
                This amount will be locked in the contract until claimed by an approved applicant
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending || isConfirming || isSuccess}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isPending ? 'Confirm in Wallet...' : 'Creating...'}
                </>
              ) : isSuccess ? (
                'Created Successfully!'
              ) : (
                'Create Scholarship'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
