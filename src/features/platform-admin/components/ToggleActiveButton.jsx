import { useState } from "react";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import { useToast } from "../../../components/ui/useToast.js";
import { errorText } from "../../../lib/errors.js";
import { setUserActive } from "../api.js";

export default function ToggleActiveButton({ user, name, onDone }) {
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function change(active) {
    setBusy(true);
    try {
      await setUserActive(user.id, active);
      toast(`${name} ${active ? "activated" : "deactivated"}.`, "ok");
      setConfirming(false);
      onDone();
    } catch (err) {
      toast(errorText(err), "bad");
    } finally {
      setBusy(false);
    }
  }

  if (!user.is_active) {
    return (
      <Button
        size="small"
        variant="primary"
        disabled={busy}
        onClick={() => change(true)}
      >
        Activate
      </Button>
    );
  }

  return (
    <>
      <Button size="small" variant="danger" onClick={() => setConfirming(true)}>
        Deactivate
      </Button>
      {confirming && (
        <Modal
          title={`Deactivate ${name}?`}
          onClose={() => setConfirming(false)}
        >
          <p>
            They are signed out everywhere and cannot sign in until you activate
            them again.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={busy}
              onClick={() => change(false)}
            >
              {busy ? "Saving…" : "Deactivate"}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
