export const PERMISSIONS = {
  CLAIM_VIEW: 'claim.view',
  CLAIM_EDIT: 'claim.edit',
  CLAIM_DELETE: 'claim.delete',
  CLAIM_ASSIGN: 'claim.assign',
  CLAIM_APPROVE: 'claim.approve',
  COMMENT_CREATE: 'comment.create',
  COMMENT_EDIT: 'comment.edit',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export type UserRole = 'claim_processor' | 'supervisor' | 'auditor';

export interface SessionUser {
  userId: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
}

export interface AuthSession {
  user: SessionUser;
  expiresAt: number;
}

export type ClaimStatus = 'open' | 'pending' | 'approved' | 'denied';

export interface Claim {
  id: string;
  claimNumber: string;
  status: ClaimStatus;
  assignee: string;
  assigneeId: string;
  claimantName: string;
  amount: number;
  submittedAt: string;
  updatedAt: string;
  documentId: string;
}

export interface ClaimsListParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: ClaimStatus;
  assignee?: string;
  q?: string;
}

export interface ClaimsListResponse {
  data: Claim[];
  total: number;
  page: number;
  pageSize: number;
}

export type CustomerStatus = 'active' | 'inactive';

export interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  country: string;
  status: CustomerStatus;
  createdAt: string;
}

export interface CustomersListParams {
  page?: number;
  pageSize?: number;
  sort?: 'newest' | 'oldest' | 'name' | 'company';
  status?: CustomerStatus;
  q?: string;
}

export interface CustomersStats {
  total: number;
  activeMembers: number;
  activeNow: number;
}

export interface CustomersListResponse {
  data: Customer[];
  total: number;
  page: number;
  pageSize: number;
  stats: CustomersStats;
}

export interface DocumentMetadata {
  id: string;
  claimId: string;
  fileName: string;
  pageCount: number;
  sizeBytes: number;
  modifiedAt: string;
  rangeUrlTemplate: string;
}

export interface Comment {
  id: string;
  documentId: string;
  page: number;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface Job {
  id: string;
  type: 'split' | 'merge';
  status: JobStatus;
  progress: number;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  status: number;
}
