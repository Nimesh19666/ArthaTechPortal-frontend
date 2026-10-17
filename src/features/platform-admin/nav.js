import { canSeeAuditLog } from "./permissions.js";

const adminNav = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/houses", label: "Production houses" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/audit-log", label: "Audit log", audit: true },
];

// The admin role does not see the Audit log.
export function navForRole(role) {
  return adminNav.filter((item) => !item.audit || canSeeAuditLog(role));
}
