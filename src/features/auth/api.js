import { api } from "../../lib/apiClient.js";
import {
  clearTokens,
  getRefreshToken,
  saveTokens,
} from "../../lib/tokenStore.js";

// Backend answer: { access, refresh, user, roles, requires_role_selection, active_role }
// The extra role fields are folded into the user object, so the rest of the app reads one object.
// Backend answer: { access, refresh, user }. user.roles lists the roles of the account.
export async function login(identifier, password) {
  const data = await api("/accounts/login/", {
    method: "POST",
    auth: false,
    body: { identifier, password },
  });
  saveTokens(data);
  return { ...data.user, roles: data.roles ?? data.user?.roles };
}
// "Who am I?" Works after a page refresh too: apiClient gets a new access token by itself.
export function fetchMe() {
  return api("/accounts/me/");
}

// Saves the chosen role on the account. The backend then uses it on every call,
// so the frontend sends no role with other requests.
export function setActiveRole(role) {
  return api("/accounts/active-role/", {
    method: "POST",
    body: { active_role: role },
  });
}

export async function logout() {
  const refresh = getRefreshToken();
  // Clear first, so the user is signed out on screen even if the server call fails.
  clearTokens();
  if (!refresh) return;
  try {
    await api("/accounts/logout/", {
      method: "POST",
      auth: false,
      body: { refresh },
    });
  } catch {
    // The token was already invalid. Nothing more to do.
  }
}
