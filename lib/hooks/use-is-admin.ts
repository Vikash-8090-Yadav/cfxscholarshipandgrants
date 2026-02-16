import { useAccount, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'

export function useIsAdmin() {
  const { address } = useAccount()
  
  const { data: adminAddress, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'admin',
  })

  return {
    isAdmin: address && adminAddress && address.toLowerCase() === adminAddress.toLowerCase(),
    isLoading,
    adminAddress,
  }
}
