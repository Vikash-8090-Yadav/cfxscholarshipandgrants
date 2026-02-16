import Link from 'next/link'
import { formatEther } from 'viem'
import type { Scholarship } from '@/types/scholarship'
import { Badge } from '@/components/ui/badge'

interface ScholarshipCardProps {
  scholarship: Scholarship
}

export function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  return (
    <Link 
      href={`/scholarships/${scholarship.id}`}
      className="block group"
    >
      <div className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors text-balance">
            {scholarship.title}
          </h3>
          <Badge variant={scholarship.isActive ? 'default' : 'secondary'}>
            {scholarship.isActive ? 'Active' : 'Closed'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 text-pretty">
          {scholarship.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary">
              {formatEther(scholarship.amount)} ETH
            </div>
            <div className="text-xs text-muted-foreground">Scholarship Amount</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
