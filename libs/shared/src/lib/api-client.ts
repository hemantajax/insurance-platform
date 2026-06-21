import type {
  ApiError,
  ClaimsListParams,
  ClaimsListResponse,
  Claim,
  Comment,
  DocumentMetadata,
  Job,
} from './types';

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiError;
    throw new Error(body.message ?? `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export async function fetchClaims(
  params: ClaimsListParams = {}
): Promise<ClaimsListResponse> {
  const response = await fetch(
    `/api/claims${buildQuery({
      page: params.page,
      pageSize: params.pageSize,
      sort: params.sort,
      order: params.order,
      status: params.status,
      assignee: params.assignee,
      q: params.q,
    })}`
  );
  return parseResponse<ClaimsListResponse>(response);
}

export async function fetchClaim(id: string): Promise<Claim> {
  const response = await fetch(`/api/claims/${id}`);
  return parseResponse<Claim>(response);
}

export async function updateClaim(
  id: string,
  data: Partial<Pick<Claim, 'status' | 'assignee' | 'assigneeId'>>
): Promise<Claim> {
  const response = await fetch(`/api/claims/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse<Claim>(response);
}

export async function deleteClaim(id: string): Promise<void> {
  const response = await fetch(`/api/claims/${id}`, { method: 'DELETE' });
  await parseResponse<{ success: boolean }>(response);
}

export async function fetchDocument(id: string): Promise<DocumentMetadata> {
  const response = await fetch(`/api/documents/${id}`);
  return parseResponse<DocumentMetadata>(response);
}

export async function fetchComments(
  documentId: string,
  page?: number
): Promise<Comment[]> {
  const response = await fetch(
    `/api/comments${buildQuery({ documentId, page })}`
  );
  return parseResponse<Comment[]>(response);
}

export async function createComment(
  data: Pick<Comment, 'documentId' | 'page' | 'body'>
): Promise<Comment> {
  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse<Comment>(response);
}

export async function createSplitJob(data: {
  documentId: string;
  ranges: Array<{ start: number; end: number }>;
}): Promise<Job> {
  const response = await fetch('/api/jobs/split', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse<Job>(response);
}

export async function createMergeJob(data: {
  documentIds: string[];
}): Promise<Job> {
  const response = await fetch('/api/jobs/merge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse<Job>(response);
}

export async function fetchJob(id: string): Promise<Job> {
  const response = await fetch(`/api/jobs/${id}`);
  return parseResponse<Job>(response);
}

export async function loginRequest(role: string): Promise<{ success: boolean }> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
  return parseResponse<{ success: boolean }>(response);
}

export async function logoutRequest(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
}

export async function fetchSession(): Promise<{ user: import('./types').SessionUser | null }> {
  const response = await fetch('/api/auth/session');
  return parseResponse<{ user: import('./types').SessionUser | null }>(response);
}
