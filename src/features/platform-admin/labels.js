// Project types must match what the backend accepts.
export const PROJECT_TYPES = {
  movie: "Movie",
  ott_series: "OTT series",
  ad: "Ad film",
  other: "Other",
};

export const FEATURE_LABELS = {
  whatsappAlerts: "WhatsApp alerts",
  billOcr: "Bill OCR",
  tallyExport: "Tally export",
  multiProjectDashboard: "Multi-project dashboard",
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
// Assumption: plan names. The server says "This plan does not exist." if one is wrong.
export const PLAN_OPTIONS = [
  ["Starter", "Starter"],
  ["Studio", "Studio"],
  ["Enterprise", "Enterprise"],
];

// Frontend feature name -> backend field name
export const FEATURE_FIELDS = {
  whatsappAlerts: "whatsapp_alerts",
  billOcr: "bill_ocr",
  tallyExport: "tally_export",
  multiProjectDashboard: "multi_project_dashboard",
};

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
