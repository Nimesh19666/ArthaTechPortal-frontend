import { useState } from "react";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import { Field, Input, Select } from "../../../components/ui/Field.jsx";
import { useToast } from "../../../components/ui/useToast.js";
import { errorText } from "../../../lib/errors.js";
import { createHouse } from "../api.js";
import { PROJECT_TYPES, toOptions } from "../labels.js";

export default function NewHouseButton({ onDone }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const payload = { name: String(form.get("name")).trim() };
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
