import { useState } from "react";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import { Field, Input } from "../../../components/ui/Field.jsx";
import { useToast } from "../../../components/ui/useToast.js";
import { errorText } from "../../../lib/errors.js";
import { updateHouse } from "../api.js";

export default function ChangePlanButton({ house, onDone }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState(house.planName ?? "");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await updateHouse(house.id, { plan_name: plan.trim() });
      toast("Plan changed.", "ok");
      setOpen(false);
      onDone();
    } catch (error) {
      toast(errorText(error), "bad");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        Change plan
      </Button>
      {open && (
        <Modal title={`Plan · ${house.name}`} onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit}>
            <Field
              label="Plan name"
              hint="Example: Studio. The server checks that the plan exists."
            >
              <Input
                required
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
              />
            </Field>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={
                  busy || !plan.trim() || plan.trim() === house.planName
                }
              >
                {busy ? "Saving..." : "Save plan"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
