import { getRole } from "../../lib/roleStore.js";

// Roles that have screens in this phase. normal_user has none yet.
const SCREEN_ROLES = ["super_admin", "admin"];

// The backend sends user.roles. If it does not yet, a superuser counts as super_admin.
export function availableRoles(user) {
  if (Array.isArray(user.roles)) {
    return user.roles.filter((role) => SCREEN_ROLES.includes(role));
  }
  return user.is_superuser ? ["super_admin"] : [];
}

// The role to use after a page reload, or null when the person must choose.
export function resolveRole(user) {
  const roles = availableRoles(user);
  if (roles.includes(user.active_role)) return user.active_role;
  const saved = getRole();
  if (roles.includes(saved)) return saved;
  return roles.length === 1 ? roles[0] : null;
}
