// Turns one house from the backend into the shape our screens use.
// If a field name differs from the real backend answer, fix it HERE only.
// Project money (budget, actual...) is not copied on purpose. It stays closed until support access exists.

function toProject(raw) {
  return {
    id: raw.id,
    name: raw.name,
    type: raw.project_type,
    teamCount: raw.team_count ?? 0,
    recordCount: raw.record_count ?? 0,
  };
}

export function toHouse(raw) {
  const plan = raw.plan && typeof raw.plan === "object" ? raw.plan : {};
  const features = raw.features ?? raw;

  return {
    id: raw.id,
    name: raw.name,
    planName: plan.name ?? raw.plan_name ?? "",
    planPricePaise: plan.price_paise ?? raw.plan_price_paise ?? 0,
    features: {
      whatsappAlerts: Boolean(features.whatsapp_alerts),
      billOcr: Boolean(features.bill_ocr),
      tallyExport: Boolean(features.tally_export),
      multiProjectDashboard: Boolean(features.multi_project_dashboard),
    },
    userCount: raw.user_count ?? 0,
    projects: (raw.projects ?? []).map(toProject),
  };
}
