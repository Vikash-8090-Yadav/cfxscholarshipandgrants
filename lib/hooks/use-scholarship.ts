import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'
import type { Scholarship } from '@/types/scholarship'

export function useScholarship(scholarshipId: number) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getScholarship',
    args: [BigInt(scholarshipId)],
  })

  return {
    scholarship: data as Scholarship | undefined,
    isLoading,
    error,
    refetch,
  }
}

export function useScholarshipCount() {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'scholarshipCount',
  })

  return {
    count: data ? Number(data) : 0,
    isLoading,
    error,
  }
}
