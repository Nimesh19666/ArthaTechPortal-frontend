import { useState } from "react";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import { Field, Input } from "../../../components/ui/Field.jsx";
import { useToast } from "../../../components/ui/useToast.js";
import { errorText } from "../../../lib/errors.js";
import { resetUserPassword } from "../api.js";

export default function ResetPasswordButton({ user, name }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password"));

    setBusy(true);
    try {
      await resetUserPassword(user.id, password);
      toast(`Password changed for ${name}. They must sign in again.`, "ok");
      setOpen(false);
    } catch (err) {
      toast(errorText(err), "bad");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        Reset password
      </Button>
      {open && (
        <Modal
          title={`Reset password · ${name}`}
          onClose={() => setOpen(false)}
        >
          <form onSubmit={handleSubmit}>
            <p className="mb-3 rounded-lg bg-panel px-3 py-2.5 text-[13.5px] text-ink-2">
              The person is signed out everywhere, and a locked account is
              unlocked. Share the new password privately.
            </p>
            <Field label="New temporary password">
              <Input
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </Field>
            <div className="mt-2 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={busy}>
                {busy ? "Saving…" : "Change password"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
