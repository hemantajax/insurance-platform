import type {
  Claim,
  ClaimStatus,
  Comment,
  Customer,
  CustomerStatus,
  DocumentMetadata,
  Job,
  SessionUser,
} from '@org/shared';
import { hasPermission, PERMISSIONS } from '@org/shared';

export const TOTAL_CLAIMS = 50_000;
export const TOTAL_CUSTOMERS = 256_000;
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

const CUSTOMER_FIRST_NAMES = [
  'Jane',
  'Floyd',
  'Ronald',
  'Marvin',
  'Jerome',
  'Kathryn',
  'Jacob',
  'Kristin',
  'Alex',
  'Maria',
  'David',
  'Sarah',
];
const CUSTOMER_LAST_NAMES = [
  'Cooper',
  'Miles',
  'Richards',
  'McKinney',
  'Bell',
  'Murphy',
  'Jones',
  'Watson',
  'Nguyen',
  'Patel',
  'Brooks',
  'Kim',
];
const CUSTOMER_COMPANIES = [
  'Microsoft',
  'Yahoo',
  'Adobe',
  'Tesla',
  'Google',
  'Facebook',
  'Amazon',
  'Netflix',
  'Apple',
  'Oracle',
];
const CUSTOMER_COUNTRIES = [
  'United States',
  'Kiribati',
  'Israel',
  'Iran',
  'Réunion',
  'Curaçao',
  'Brazil',
  'Åland Islands',
  'Canada',
  'Germany',
  'Japan',
  'Australia',
];

const customerCache = new Map<number, Customer>();
const ACTIVE_CUSTOMER_RATIO = 0.35;

function formatPhone(random: () => number): string {
  const area = 200 + Math.floor(random() * 600);
  const prefix = 100 + Math.floor(random() * 900);
  const line = String(Math.floor(random() * 10_000)).padStart(4, '0');
  return `(${area}) ${prefix}-${line}`;
}

function generateCustomer(index: number): Customer {
  const random = mulberry32(index + 10_001);
  const firstName = pick(random, CUSTOMER_FIRST_NAMES);
  const lastName = pick(random, CUSTOMER_LAST_NAMES);
  const company = pick(random, CUSTOMER_COMPANIES);
  const slug = `${firstName}.${lastName}`.toLowerCase().replace(/\s+/g, '');
  const domain = company.toLowerCase().replace(/\s+/g, '');
  const status: CustomerStatus = random() < ACTIVE_CUSTOMER_RATIO ? 'active' : 'inactive';
  const createdAt = new Date(Date.UTC(2023, 0, 1) + index * 3_600_000).toISOString();

  return {
    id: `customer-${index + 1}`,
    name: `${firstName} ${lastName}`,
    company,
    phone: formatPhone(random),
    email: `${slug}${index % 97}@${domain}.com`,
    country: pick(random, CUSTOMER_COUNTRIES),
    status,
    createdAt,
    documentId: `doc-${index + 1}`,
  };
}

export function getCustomerByIndex(index: number): Customer {
  const cached = customerCache.get(index);
  if (cached) {
    return cached;
  }
  const customer = generateCustomer(index);
  customerCache.set(index, customer);
  return customer;
}

export function getCustomerById(id: string): Customer | undefined {
  const match = /^customer-(\d+)$/.exec(id);
  if (!match) {
    return undefined;
  }
  const index = Number(match[1]) - 1;
  if (index < 0 || index >= TOTAL_CUSTOMERS) {
    return undefined;
  }
  return getCustomerByIndex(index);
}

export interface CustomersQuery {
  page: number;
  pageSize: number;
  sort?: 'newest' | 'oldest' | 'name' | 'company';
  status?: CustomerStatus;
  q?: string;
}

function compareCustomers(
  a: Customer,
  b: Customer,
  sort: CustomersQuery['sort']
): number {
  switch (sort) {
    case 'name':
      return a.name.localeCompare(b.name);
    case 'company':
      return a.company.localeCompare(b.company);
    case 'oldest':
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    case 'newest':
    default:
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }
}

function matchesCustomerFilters(customer: Customer, query: CustomersQuery): boolean {
  if (query.status && customer.status !== query.status) {
    return false;
  }
  if (query.q) {
    const needle = query.q.toLowerCase();
    const haystack =
      `${customer.name} ${customer.company} ${customer.email} ${customer.country}`.toLowerCase();
    if (!haystack.includes(needle)) {
      return false;
    }
  }
  return true;
}

export function getCustomerStats(): {
  total: number;
  activeMembers: number;
  activeNow: number;
} {
  return {
    total: TOTAL_CUSTOMERS,
    activeMembers: Math.floor(TOTAL_CUSTOMERS * ACTIVE_CUSTOMER_RATIO),
    activeNow: 189,
  };
}

export function queryCustomers(query: CustomersQuery): { data: Customer[]; total: number } {
  const sort = query.sort ?? 'newest';
  const hasFilter = Boolean(query.status || query.q);
  const start = Math.max(0, (query.page - 1) * query.pageSize);

  // Fast path: the default browsing experience (no filter/search, sorted by
  // creation date). `createdAt` is monotonic with the record index, so we can
  // resolve the requested page directly without materialising the full dataset.
  // This keeps the request O(pageSize) instead of O(256k) and avoids serverless
  // timeouts that made the endpoint look unresponsive.
  if (!hasFilter && (sort === 'newest' || sort === 'oldest')) {
    const total = TOTAL_CUSTOMERS;
    if (start >= total) {
      return { data: [], total };
    }
    const end = Math.min(start + query.pageSize, total);
    const data: Customer[] = [];
    for (let offset = start; offset < end; offset += 1) {
      const index = sort === 'newest' ? total - 1 - offset : offset;
      data.push(getCustomerByIndex(index));
    }
    return { data, total };
  }

  // Slow path: filtering, search, or name/company sort require a full scan.
  // Records are generated in index order (oldest first), so date sorting needs
  // only a cheap reverse rather than an O(n log n) comparator pass.
  const matches: Customer[] = [];
  for (let index = 0; index < TOTAL_CUSTOMERS; index += 1) {
    const customer = getCustomerByIndex(index);
    if (matchesCustomerFilters(customer, query)) {
      matches.push(customer);
    }
  }

  if (sort === 'newest') {
    matches.reverse();
  } else if (sort === 'name' || sort === 'company') {
    matches.sort((a, b) => compareCustomers(a, b, sort));
  }

  const data = matches.slice(start, start + query.pageSize);
  return { data, total: matches.length };
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
    fileName: `document-${String(index).padStart(6, '0')}.pdf`,
    pageCount,
    sizeBytes,
    modifiedAt: new Date(Date.now() - random() * 86_400_000 * 30).toISOString(),
    rangeUrlTemplate: `/api/documents/${documentId}/pages/{page}`,
  };
}

/**
 * Generates a lightweight SVG "page" on demand so the viewer can stream real
 * per-page content without shipping a multi-hundred-MB binary. Each page is a
 * few KB, proving the page-range streaming + virtualization strategy.
 */
export function renderPlaceholderPage(
  documentId: string,
  page: number
): string | undefined {
  const metadata = getDocumentMetadata(documentId);
  if (!metadata || page < 1 || page > metadata.pageCount) {
    return undefined;
  }
  const random = mulberry32(page * 7 + documentId.length);
  const lineCount = 14 + Math.floor(random() * 10);
  const lines: string[] = [];
  for (let i = 0; i < lineCount; i += 1) {
    const width = 120 + Math.floor(random() * 520);
    const y = 150 + i * 42;
    lines.push(
      `<rect x="80" y="${y}" width="${width}" height="14" rx="3" fill="#e2e8f0" />`
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1132" viewBox="0 0 800 1132" role="img" aria-label="Page ${page}">
  <rect width="800" height="1132" fill="#ffffff" stroke="#e5e7eb" stroke-width="2" />
  <text x="80" y="96" font-family="ui-sans-serif, system-ui, sans-serif" font-size="34" font-weight="700" fill="#0f172a">${metadata.fileName}</text>
  <text x="80" y="128" font-family="ui-sans-serif, system-ui, sans-serif" font-size="18" fill="#64748b">Page ${page} of ${metadata.pageCount}</text>
  ${lines.join('\n  ')}
  <text x="720" y="1100" text-anchor="end" font-family="ui-sans-serif, system-ui, sans-serif" font-size="16" fill="#94a3b8">${page}</text>
</svg>`;
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
