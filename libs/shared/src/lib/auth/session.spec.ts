import {
  buildSessionUser,
  getPermissionsForRole,
  hasPermission,
  PERMISSIONS,
} from './session';

describe('auth permissions', () => {
  it('maps processor permissions', () => {
    const permissions = getPermissionsForRole('claim_processor');
    expect(permissions).toContain(PERMISSIONS.CLAIM_VIEW);
    expect(permissions).toContain(PERMISSIONS.CLAIM_EDIT);
    expect(permissions).not.toContain(PERMISSIONS.CLAIM_DELETE);
  });

  it('maps supervisor permissions', () => {
    const permissions = getPermissionsForRole('supervisor');
    expect(permissions).toContain(PERMISSIONS.CLAIM_DELETE);
    expect(permissions).toContain(PERMISSIONS.CLAIM_ASSIGN);
  });

  it('auditor is read-only', () => {
    const user = buildSessionUser('auditor');
    expect(hasPermission(user, PERMISSIONS.CLAIM_VIEW)).toBe(true);
    expect(hasPermission(user, PERMISSIONS.CLAIM_EDIT)).toBe(false);
    expect(hasPermission(user, PERMISSIONS.CLAIM_DELETE)).toBe(false);
  });
});
