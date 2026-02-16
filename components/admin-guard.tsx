'use client'

import { ReactNode } from 'react'
import { useAccount } from 'wagmi'
import { useIsAdmin } from '@/lib/hooks/use-is-admin'
import { WalletButton } from '@/components/wallet-button'
import { Loader2, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

interface AdminGuardProps {
  children: ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isConnected } = useAccount()
  const { isAdmin, isLoading } = useIsAdmin()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShieldAlert className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Connect Wallet</h2>
          <p className="text-muted-foreground mb-6">
            Please connect your wallet to access the admin dashboard
          </p>
          <WalletButton />
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You do not have permission to access the admin dashboard. Please connect with an admin wallet.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
