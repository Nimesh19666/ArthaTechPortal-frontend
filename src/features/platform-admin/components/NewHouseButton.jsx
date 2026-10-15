import { useState } from "react";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import { Field, Input, Select } from "../../../components/ui/Field.jsx";
import { useToast } from "../../../components/ui/useToast.js";
import { errorText } from "../../../lib/errors.js";
import { rupeesToPaise } from "../../../lib/money.js";
import { createHouse } from "../api.js";
import { FEATURE_LABELS, PROJECT_TYPES, toOptions } from "../labels.js";

// Form field name for each feature, as the backend expects it.
const FEATURE_FIELDS = {
  whatsappAlerts: "whatsapp_alerts",
  billOcr: "bill_ocr",
  tallyExport: "tally_export",
  multiProjectDashboard: "multi_project_dashboard",
};

export default function NewHouseButton({ onDone }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const payload = {
      name: String(form.get("name")).trim(),
      plan_name: String(form.get("plan_name")).trim(),
    };
    const price = String(form.get("price")).trim();
    if (price) payload.plan_price_paise = rupeesToPaise(price);
    for (const field of Object.values(FEATURE_FIELDS)) {
      payload[field] = form.get(field) === "on";
    }
    const projectName = String(form.get("project_name")).trim();
    if (projectName) {
      payload.projects = [
        {
          name: projectName,
          project_type: form.get("project_type"),
          teams: [],
        },
      ];
    }

    setBusy(true);
    try {
      await createHouse(payload);
      toast(`${payload.name} created.`, "ok");
      setOpen(false);
      onDone();
    } catch (err) {
      toast(errorText(err), "bad");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        New production house
      </Button>
      {open && (
        <Modal title="New production house" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit}>
            <Field label="House name">
              <Input name="name" required placeholder="Example: Lotus Films" />
            </Field>
            <div className="grid gap-x-3.5 sm:grid-cols-2">
              <Field label="Plan name" hint="Reused if it already exists.">
                <Input name="plan_name" required placeholder="Studio" />
              </Field>
              <Field
                label="Plan price in rupees"
                hint="Whole rupees, for example 24999."
              >
                <Input
                  name="price"
                  inputMode="numeric"
                  pattern="[0-9]+"
                  placeholder="24999"
                />
              </Field>
            </div>

            <p className="mb-1.5 text-[13.5px] font-semibold">Features</p>
            <div className="mb-3 grid gap-1.5 sm:grid-cols-2">
              {Object.entries(FEATURE_LABELS).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 text-[14px]"
                >
                  <input
                    type="checkbox"
                    name={FEATURE_FIELDS[key]}
                    className="size-4.5 accent-brand"
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className="grid gap-x-3.5 sm:grid-cols-2">
              <Field label="First project (optional)">
                <Input name="project_name" placeholder="Example: King 3" />
              </Field>
              <Field label="Project type">
                <Select
                  name="project_type"
                  options={toOptions(PROJECT_TYPES)}
                  defaultValue="movie"
                />
              </Field>
            </div>

            <div className="mt-2 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={busy}>
                {busy ? "Creating…" : "Create house"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
