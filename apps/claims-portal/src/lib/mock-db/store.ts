import type {
  Claim,
  ClaimStatus,
  Comment,
  DocumentMetadata,
  Job,
  SessionUser,
} from '@org/shared';
import { hasPermission, PERMISSIONS } from '@org/shared';

export const TOTAL_CLAIMS = 50_000;
export const MOCK_DELAY_MS = { min: 200, max: 800 };

export const ASSIGNEES = [
  { id: 'user-processor-1', name: 'Alex Processor' },
  { id: 'user-processor-2', name: 'Casey Morgan' },
  { id: 'user-processor-3', name: 'Riley Chen' },
  { id: 'user-supervisor-1', name: 'Sam Supervisor' },
  { id: 'user-auditor-1', name: 'Jordan Auditor' },
];

const STATUSES: ClaimStatus[] = ['open', 'pending', 'approved', 'denied'];
const FIRST_NAMES = ['Jane', 'John', 'Maria', 'David', 'Sarah', 'Michael', 'Emily'];
const LAST_NAMES = ['Cooper', 'Miles', 'Nguyen', 'Patel', 'Brooks', 'Kim', 'Reed'];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(random: () => number, items: T[]): T {
  return items[Math.floor(random() * items.length)]!;
}

function generateClaim(index: number): Claim {
  const random = mulberry32(index + 1);
  const assignee = pick(random, ASSIGNEES);
  const submitted = new Date(Date.UTC(2024, 0, 1) + index * 86_400_000);
  const updated = new Date(submitted.getTime() + random() * 2_592_000_000);
  const claimNumber = `CLM-${String(index + 1).padStart(6, '0')}`;

  return {
    id: `claim-${index + 1}`,
    claimNumber,
    status: pick(random, STATUSES),
    assignee: assignee.name,
    assigneeId: assignee.id,
    claimantName: `${pick(random, FIRST_NAMES)} ${pick(random, LAST_NAMES)}`,
    amount: Math.round((random() * 50_000 + 500) * 100) / 100,
    submittedAt: submitted.toISOString(),
    updatedAt: updated.toISOString(),
    documentId: `doc-${index + 1}`,
  };
}

const claimCache = new Map<number, Claim>();

export function getClaimByIndex(index: number): Claim {
  const cached = claimCache.get(index);
  if (cached) {
    return cached;
  }
  const claim = generateClaim(index);
  claimCache.set(index, claim);
  return claim;
}

export function getClaimById(id: string): Claim | undefined {
  const match = /^claim-(\d+)$/.exec(id);
  if (!match) {
    return undefined;
  }
  const index = Number(match[1]) - 1;
  if (index < 0 || index >= TOTAL_CLAIMS) {
    return undefined;
  }
  return getClaimByIndex(index);
}

export interface ClaimsQuery {
  page: number;
  pageSize: number;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: ClaimStatus;
  assignee?: string;
  q?: string;
}

function compareClaims(a: Claim, b: Claim, sort: string, order: 'asc' | 'desc'): number {
  const direction = order === 'asc' ? 1 : -1;
  switch (sort) {
    case 'claimNumber':
      return a.claimNumber.localeCompare(b.claimNumber) * direction;
    case 'status':
      return a.status.localeCompare(b.status) * direction;
    case 'assignee':
      return a.assignee.localeCompare(b.assignee) * direction;
    case 'amount':
      return (a.amount - b.amount) * direction;
    case 'submittedAt':
    case 'date':
    default:
      return (
        (new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()) *
        direction
      );
  }
}

function matchesFilters(claim: Claim, query: ClaimsQuery): boolean {
  if (query.status && claim.status !== query.status) {
    return false;
  }
  if (query.assignee && claim.assigneeId !== query.assignee) {
    return false;
  }
  if (query.q) {
    const needle = query.q.toLowerCase();
    const haystack = `${claim.claimNumber} ${claim.assignee} ${claim.claimantName}`.toLowerCase();
    if (!haystack.includes(needle)) {
      return false;
    }
  }
  return true;
}

export function queryClaims(query: ClaimsQuery): { data: Claim[]; total: number } {
  const matches: Claim[] = [];

  for (let index = 0; index < TOTAL_CLAIMS; index += 1) {
    const claim = getClaimByIndex(index);
    if (matchesFilters(claim, query)) {
      matches.push(claim);
    }
  }

  const sort = query.sort ?? 'submittedAt';
  const order = query.order ?? 'desc';
  matches.sort((a, b) => compareClaims(a, b, sort, order));

  const start = (query.page - 1) * query.pageSize;
  const data = matches.slice(start, start + query.pageSize);
  return { data, total: matches.length };
}

export function updateClaimRecord(
  id: string,
  patch: Partial<Pick<Claim, 'status' | 'assignee' | 'assigneeId'>>
): Claim | undefined {
  const claim = getClaimById(id);
  if (!claim) {
    return undefined;
  }
  const updated: Claim = {
    ...claim,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  const index = Number(id.replace('claim-', '')) - 1;
  claimCache.set(index, updated);
  return updated;
}

export function deleteClaimRecord(id: string): boolean {
  const index = Number(id.replace('claim-', '')) - 1;
  if (index < 0 || index >= TOTAL_CLAIMS) {
    return false;
  }
  claimCache.delete(index);
  return true;
}

export function getDocumentMetadata(documentId: string): DocumentMetadata | undefined {
  const match = /^doc-(\d+)$/.exec(documentId);
  if (!match) {
    return undefined;
  }
  const index = Number(match[1]);
  const random = mulberry32(index);
  const pageCount = Math.floor(random() * 400) + 20;
  const sizeBytes = Math.floor(random() * 900_000_000) + 150_000_000;

  return {
    id: documentId,
    claimId: `claim-${index}`,
    fileName: `claim-${String(index).padStart(6, '0')}.pdf`,
    pageCount,
    sizeBytes,
    modifiedAt: new Date(Date.now() - random() * 86_400_000 * 30).toISOString(),
    rangeUrlTemplate: `/api/documents/${documentId}/pages/{page}`,
  };
}

const comments = new Map<string, Comment[]>();
const jobs = new Map<string, Job>();

export function listComments(documentId: string, page?: number): Comment[] {
  const all = comments.get(documentId) ?? [];
  if (page === undefined) {
    return all;
  }
  return all.filter((comment) => comment.page === page);
}

export function addComment(input: {
  documentId: string;
  page: number;
  body: string;
  author: SessionUser;
}): Comment {
  const comment: Comment = {
    id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    documentId: input.documentId,
    page: input.page,
    authorId: input.author.userId,
    authorName: input.author.name,
    body: input.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const existing = comments.get(input.documentId) ?? [];
  comments.set(input.documentId, [...existing, comment]);
  return comment;
}

export function createJob(type: 'split' | 'merge'): Job {
  const job: Job = {
    id: `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    status: 'pending',
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  jobs.set(job.id, job);
  return job;
}

export function getJob(id: string): Job | undefined {
  const job = jobs.get(id);
  if (!job) {
    return undefined;
  }

  if (job.status === 'completed' || job.status === 'failed') {
    return job;
  }

  const elapsed = Date.now() - new Date(job.createdAt).getTime();
  const progress = Math.min(100, Math.floor(elapsed / 120));
  const next: Job = {
    ...job,
    progress,
    status: progress >= 100 ? 'completed' : 'running',
    updatedAt: new Date().toISOString(),
    message: progress >= 100 ? 'Job completed' : 'Processing…',
  };
  jobs.set(id, next);
  return next;
}

export async function simulateDelay(simulateError?: string | null) {
  if (simulateError === '500') {
    throw new Error('Simulated server error');
  }
  const delay =
    MOCK_DELAY_MS.min +
    Math.floor(Math.random() * (MOCK_DELAY_MS.max - MOCK_DELAY_MS.min));
  await new Promise((resolve) => setTimeout(resolve, delay));
}

export function requirePermission(user: SessionUser | null, permission: string) {
  if (!user || !hasPermission(user, permission as (typeof PERMISSIONS)[keyof typeof PERMISSIONS])) {
    return false;
  }
  return true;
}

export function getSessionUserFromRequest(request: Request): SessionUser | null {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const match = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('claims-session='));
  if (!match) {
    return null;
  }
  const token = decodeURIComponent(match.split('=')[1] ?? '');
  try {
    const session = JSON.parse(Buffer.from(token, 'base64').toString('utf-8')) as {
      user: SessionUser;
      expiresAt: number;
    };
    if (!session?.user || session.expiresAt < Date.now()) {
      return null;
    }
    return session.user;
  } catch {
    return null;
  }
}
