const CRM_LAYOUT_PREFIXES = ['/dashboard', '/claims', '/customers'] as const;

export function isCrmLayoutRoute(pathname: string): boolean {
  return CRM_LAYOUT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
