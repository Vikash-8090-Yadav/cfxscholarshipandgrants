import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { confluxESpaceTestnet } from 'wagmi/chains'
import { http } from 'wagmi'

export const config = getDefaultConfig({
  appName: 'OnChain Scholarship',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '4d9e4e2c8b1c4f5e3a6b2c1d0e8f7a9b',
  chains: [confluxESpaceTestnet],
  transports: {
    [confluxESpaceTestnet.id]: http(process.env.NEXT_PUBLIC_CONFLUX_ESPACE_RPC_URL),
  },
  ssr: false,
})
