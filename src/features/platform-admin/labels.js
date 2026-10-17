// Project types must match what the backend accepts.
export const PROJECT_TYPES = {
  movie: "Movie",
  ott_series: "OTT series",
  ad: "Ad film",
  other: "Other",
};

export const ROLE_LABELS = {
  producer: "Producer",
  lineproducer: "Line Producer",
  pm: "Production Manager",
  teamhead: "Team Head",
  auditor: "Auditor",
  accountant: "Accountant",
  finance: "Finance",
};

export function toOptions(labels) {
  return Object.entries(labels);
}
// Roles the backend accepts in POST /accounts/users/.
export const USER_ROLES = {
  super_admin: "Super admin",
  admin: "Admin",
  normal_user: "Normal user",
};
