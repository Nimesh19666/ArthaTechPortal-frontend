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
