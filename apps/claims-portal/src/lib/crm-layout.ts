const CRM_LAYOUT_PREFIXES = [
  '/dashboard',
  '/claims',
  '/customers',
  '/product',
  '/income',
  '/promote',
  '/help',
] as const;

export function isCrmLayoutRoute(pathname: string): boolean {
  return CRM_LAYOUT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
