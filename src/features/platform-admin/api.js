import { api } from "../../lib/apiClient.js";
import { toHouse } from "./houseMapper.js";

export async function getHouses() {
  const data = await api("/organisations/");
  // console.log('raw houses', data)   // switch on if a screen shows empty values
  const list = Array.isArray(data) ? data : (data.results ?? data.houses ?? []);
  return list.map(toHouse);
}

export function createHouse(payload) {
  return api("/organisations/createhouse/", { method: "POST", body: payload });
}

export function uploadExcel(file) {
  const form = new FormData();
  form.append("file", file); // the field must be named exactly "file"
  return api("/organisations/upload/", { method: "POST", body: form });
}

// type: member, team, project, organisation or plan
export function removeItem(type, id) {
  return api(`/organisations/remove/${type}/${id}/`, { method: "DELETE" });
}

// ----- Users (superuser only) -----

// Backend answer: a list of { id, email, username, full_name, is_active, is_superuser }
export function getUsers() {
  return api("/accounts/users/");
}

export function createUser(payload) {
  return api("/accounts/users/", { method: "POST", body: payload });
}

// Deactivating also logs the person out everywhere.
export function setUserActive(id, active) {
  return api(`/accounts/users/${id}/${active ? "activate" : "deactivate"}/`, {
    method: "POST",
  });
}

// Also unlocks the account and logs the person out everywhere.
export function resetUserPassword(id, newPassword) {
  return api(`/accounts/users/${id}/reset-password/`, {
    method: "POST",
    body: { new_password: newPassword },
  });
}
export function getAuditLog() {
  return api("/organisations/audit-log/"); // last 100 lines, newest first
}

export function updateHouse(id, changes) {
  return api(`/organisations/update/${id}/`, {
    method: "PATCH",
    body: changes,
  });
}

export function addItems(houseId, projects) {
  return api(`/organisations/add/${houseId}/`, {
    method: "POST",
    body: { projects },
  });
}

// kind: members (parent = team id), teams (parent = project id), projects (parent = house id)
export function removeAll(kind, parentId) {
  return api(`/organisations/remove-all/${kind}/${parentId}/`, {
    method: "DELETE",
  });
}
