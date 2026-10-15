import { useState } from "react";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import { useToast } from "../../../components/ui/useToast.js";
import { errorText } from "../../../lib/errors.js";
import { removeItem } from "../api.js";

// type: 'organisation' or 'project'. The backend refuses if something is still inside.
export default function RemoveButton({ type, id, name, hint, onDone }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleRemove() {
    setBusy(true);
    try {
      await removeItem(type, id);
      toast(`${name} removed.`, "ok");
      setOpen(false);
      onDone();
    } catch (err) {
      toast(errorText(err), "bad");
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button size="small" variant="danger" onClick={() => setOpen(true)}>
        Remove
      </Button>
      {open && (
        <Modal title={`Remove ${name}?`} onClose={() => setOpen(false)}>
          <p>This cannot be undone.</p>
          {hint && (
            <p className="mt-3 rounded-lg bg-panel px-3 py-2.5 text-[13.5px] text-ink-2">
              {hint}
            </p>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRemove} disabled={busy}>
              {busy ? "Removing…" : "Remove"}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
