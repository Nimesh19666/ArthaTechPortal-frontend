import { useState } from "react";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import { useToast } from "../../../components/ui/useToast.js";
import { errorText } from "../../../lib/errors.js";
import { removeAll } from "../api.js";

// label: button text. what: words for the confirm box, for example "all people of Camera".
export default function RemoveAllButton({
  kind,
  parentId,
  label,
  what,
  onDone,
}) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    setBusy(true);
    try {
      const result = await removeAll(kind, parentId);
      const d = result.deleted ?? {};
      toast(
        `Removed ${d.members ?? 0} people, ${d.teams ?? 0} teams, ${d.projects ?? 0} projects.`,
        "ok",
      );
      setOpen(false);
      onDone();
    } catch (error) {
      toast(errorText(error), "bad");
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button size="small" variant="danger" onClick={() => setOpen(true)}>
        {label}
      </Button>
      {open && (
        <Modal title={label} onClose={() => setOpen(false)}>
          <p className="mb-4 text-sm">
            This removes <b>{what}</b>, with everything inside them. It cannot
            be undone. Nothing is removed if any project has spending.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" disabled={busy} onClick={handleConfirm}>
              {busy ? "Removing..." : "Yes, remove"}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
