import { availableRoles } from "../features/auth/roles.js";

// Anyone with at least one allowed role may enter the admin screens.
export function isPlatformAdmin(user) {
  return availableRoles(user).length > 0;
}

// Where a user lands after login. null means "no screens for this user yet".
export function roleHome(user) {
  return isPlatformAdmin(user) ? "/admin" : null;
}
