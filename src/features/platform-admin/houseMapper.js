// The list from GET /organisations/ is flat. Money fields stay in paise.
function toMember(m) {
  return {
    id: m.id,
    name: m.name,
    phone: m.phone,
    isTeamHead: m.is_team_head,
    isActive: m.is_active,
  };
}

function toTeam(t) {
  return {
    id: t.id,
    name: t.name,
    members: (t.members ?? []).map(toMember),
  };
}

export function toProject(p) {
  return {
    id: p.id,
    name: p.name,
    type: p.project_type,
    teamCount: p.team_count,
    recordCount: p.record_count,
    teams: (p.teams ?? []).map(toTeam),
    // budget, actual, committed and remaining are not mapped on purpose (support access rule)
  };
}

export function toHouse(h) {
  return {
    id: h.id,
    name: h.name,
    planName: h.plan, // plan name, for example "Studio"
    planPricePaise: h.plan_price_paise,
    isSuspended: h.is_suspended,
    suspendedReason: h.suspended_reason,
    userCount: h.user_count,
    features: {
      whatsappAlerts: h.whatsapp_alerts,
      billOcr: h.bill_ocr,
      tallyExport: h.tally_export,
      multiProjectDashboard: h.multi_project_dashboard,
    },
    projects: (h.projects ?? []).map(toProject),
  };
}
