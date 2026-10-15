import { useState } from "react";
import Async from "../../../components/ui/Async.jsx";
import Card from "../../../components/ui/Card.jsx";
import PageHead from "../../../components/ui/PageHead.jsx";
import { Input, Select } from "../../../components/ui/Field.jsx";
import Table, { TwoLine } from "../../../components/ui/Table.jsx";
import { formatDateTime } from "../../../lib/dates.js";
import { useLoad } from "../../../lib/useLoad.js";
import { getAuditLog } from "../api.js";

const ACTIONS = {
  "login.ok": "Login",
  "login.failed": "Login failed",
  "login.locked": "Account locked",
  "house.created": "House created",
  "house.excel_uploaded": "Excel uploaded",
  "house.updated": "House updated",
  "house.items_added": "Items added",
  "member.switched_off": "Person switched off",
  "plan.removed": "Plan removed",
  "organisation.removed": "House removed",
  "project.removed": "Project removed",
  "team.removed": "Team removed",
  "member.removed": "Person removed",
  "members.removed_all": "All people removed",
  "teams.removed_all": "All teams removed",
  "projects.removed_all": "All projects removed",
};

const FIELDS = {
  plan: "Plan",
  is_suspended: "Suspended",
  whatsapp_alerts: "WhatsApp alerts",
  bill_ocr: "Bill OCR",
  tally_export: "Tally export",
  multi_project_dashboard: "Multi-project dashboard",
};

const show = (v) => (v === true ? "On" : v === false ? "Off" : String(v));

function detailText(details) {
  if (!details) return "";
  const parts = [];
  for (const [key, value] of Object.entries(details)) {
    if (key === "changes") {
      for (const [field, c] of Object.entries(value)) {
        parts.push(
          `${FIELDS[field] ?? field}: ${show(c.from)} → ${show(c.to)}`,
        );
      }
    } else if (key === "suspended_reason") {
      if (value) parts.push(`Reason: ${value}`);
    } else {
      parts.push(
        `${key}: ${typeof value === "object" ? JSON.stringify(value) : value}`,
      );
    }
  }
  return parts.join(" · ");
}

const columns = [
  {
    header: "When",
    render: (e) => (
      <span className="whitespace-nowrap">{formatDateTime(e.created_at)}</span>
    ),
  },
  { header: "Who", render: (e) => e.user ?? "Not logged in" },
  {
    header: "Action",
    render: (e) => (
      <TwoLine main={ACTIONS[e.action] ?? e.action} sub={e.action} />
    ),
  },
  {
    header: "On",
    render: (e) => (e.target_type ? `${e.target_type} #${e.target_id}` : ""),
  },
  { header: "Detail", render: (e) => detailText(e.details) },
];

function matches(entry, search, action) {
  if (action && entry.action !== action) return false;
  const text =
    `${entry.user} ${entry.action} ${entry.target_type} ${detailText(entry.details)}`.toLowerCase();
  return text.includes(search.trim().toLowerCase());
}

const actionOptions = [["", "All actions"], ...Object.entries(ACTIONS)];

export default function AuditLogPanel() {
  const state = useLoad(getAuditLog);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");

  return (
    <>
      <PageHead
        title="Audit log"
        text="The last 100 entries, newest first. Entries are never edited or deleted."
      />
      <div className="grid gap-2.5 sm:grid-cols-[1fr_220px]">
        <Input
          type="search"
          aria-label="Search the log"
          placeholder="Search by person, action or detail"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          aria-label="Filter by action"
          options={actionOptions}
          value={action}
          onChange={(e) => setAction(e.target.value)}
        />
      </div>
      <Async state={state}>
        {(entries) => (
          <Card>
            <Table
              columns={columns}
              rows={entries.filter((e) => matches(e, search, action))}
              getKey={(e) => e.id}
              empty="No log entries match."
            />
          </Card>
        )}
      </Async>
    </>
  );
}
