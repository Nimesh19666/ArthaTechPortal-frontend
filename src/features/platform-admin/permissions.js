// Only the super admin sees the Audit log. The backend must refuse the admin role too.
export function canSeeAuditLog(role) {
  return role === "super_admin";
}

// An admin cannot deactivate a person who has the admin role. Everyone else is unchanged.
// Screen only: the backend must enforce this too.
export function canDeactivate(role, target) {
  if (role !== "admin") return true;
  const roles = target.roles ?? (target.role ? [target.role] : []);
  return !roles.includes("admin");
}

// Roles a person may give when creating a user (from the API doc).
export function creatableRoles(role) {
  if (role === "super_admin") return ["super_admin", "admin", "normal_user"];
  if (role === "admin") return ["admin", "normal_user"];
  return [];
}
