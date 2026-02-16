export interface Scholarship {
  id: bigint
  title: string
  description: string
  amount: bigint
  isActive: boolean
}

export enum ApplicationStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Claimed = 3,
}

export interface Application {
  applicant: string
  metadataURI: string
  status: ApplicationStatus
}

export interface ApplicationMetadata {
  applicantName: string
  email: string
  essay: string
  timestamp: number
}
