import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { ClientProviders } from '@/components/providers/client-providers'

const geistSans = Geist({ 
  subsets: ['latin'],
  variable: '--font-geist-sans',
})
const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'OnChain Scholarship - Blockchain-Powered Education Funding',
  description: 'Connect students with blockchain-based educational funding opportunities. Transparent, secure, and decentralized scholarship platform.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
