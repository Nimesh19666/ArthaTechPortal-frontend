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
