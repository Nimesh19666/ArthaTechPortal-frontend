// The role the person chose after login: "super_admin" or "admin".
// It only decides what the screen shows. The server checks the real role.
const KEY = "fb.role";

export function getRole() {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function saveRole(role) {
  try {
    sessionStorage.setItem(KEY, role);
  } catch {
    // storage blocked: the app still works, the role is read again at the next login
  }
}

export function clearRole() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // nothing to clear
  }
}
