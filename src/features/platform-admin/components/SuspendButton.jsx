import { useState } from "react";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import { Field, Textarea } from "../../../components/ui/Field.jsx";
import { useToast } from "../../../components/ui/useToast.js";
import { errorText } from "../../../lib/errors.js";
import { updateHouse } from "../api.js";

export default function SuspendButton({ house, onDone }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(changes, okMessage) {
    setBusy(true);
    try {
      await updateHouse(house.id, changes);
      toast(okMessage, "ok");
      setOpen(false);
      setReason("");
      onDone();
    } catch (error) {
      toast(errorText(error), "bad");
    } finally {
      setBusy(false);
    }
  }

  if (house.isSuspended) {
    return (
      <Button
        size="small"
        variant="primary"
        disabled={busy}
        onClick={() => save({ is_suspended: false }, "House is active again.")}
      >
        Unsuspend
      </Button>
    );
  }

  return (
    <>
      <Button size="small" variant="danger" onClick={() => setOpen(true)}>
        Suspend
      </Button>
      {open && (
        <Modal title={`Suspend ${house.name}`} onClose={() => setOpen(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save(
                { is_suspended: true, suspended_reason: reason.trim() },
                "House suspended.",
              );
            }}
          >
            <Field
              label="Reason"
              hint="Required. It is written to the audit log."
            >
              <Textarea
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Field>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                disabled={busy || !reason.trim()}
              >
                {busy ? "Saving..." : "Suspend house"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
