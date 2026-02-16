import { useAccount, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'
import { ApplicationStatus } from '@/types/scholarship'

export function useApplicationStatus(scholarshipId: number) {
  const { address } = useAccount()
  
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getApplicationStatus',
    args: address ? [BigInt(scholarshipId), address] : undefined,
  })

  return {
    status: data as ApplicationStatus | undefined,
    isLoading,
    error,
    refetch,
  }
}
