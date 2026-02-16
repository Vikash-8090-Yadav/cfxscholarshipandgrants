'use client'

import Link from 'next/link'
import { WalletButton } from '@/components/wallet-button'
import { useIsAdmin } from '@/lib/hooks/use-is-admin'
import { useScholarshipCount } from '@/lib/hooks/use-scholarship'
import { GraduationCap, Shield, Zap, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const { isAdmin } = useIsAdmin()
  const { count } = useScholarshipCount()

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
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Admin
                </Link>
              )}
              <WalletButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-balance mb-6">
              Blockchain-Powered{' '}
              <span className="text-primary">Education Funding</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty leading-relaxed">
              Transparent, secure, and decentralized scholarship platform connecting students with educational opportunities on the blockchain.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/scholarships"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Explore Scholarships
                <ArrowRight className="w-4 h-4" />
              </Link>
              {isAdmin && (
                <Link
                  href="/admin/create"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
                >
                  Create Scholarship
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-card border border-border">
              <div className="text-4xl font-bold text-primary mb-2">
                {count}
              </div>
              <div className="text-sm text-muted-foreground">
                Active Scholarships
              </div>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border border-border">
              <div className="text-4xl font-bold text-primary mb-2">
                100%
              </div>
              <div className="text-sm text-muted-foreground">
                Transparent & On-Chain
              </div>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border border-border">
              <div className="text-4xl font-bold text-primary mb-2">
                0%
              </div>
              <div className="text-sm text-muted-foreground">
                Platform Fees
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16 text-balance">
            Why Choose OnChain Scholarships?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fully Transparent</h3>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                Every transaction is recorded on the blockchain, ensuring complete transparency and accountability.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Payments</h3>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                Approved students receive funds directly to their wallet with no intermediaries or delays.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Students</h3>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                Designed to empower students with easy access to educational funding opportunities worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            Built on Ethereum. Powered by blockchain technology.
          </p>
        </div>
      </footer>
    </div>
  )
}
