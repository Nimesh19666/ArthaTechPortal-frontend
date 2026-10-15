import { useState } from "react";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import { Field, Input } from "../../../components/ui/Field.jsx";
import { useToast } from "../../../components/ui/useToast.js";
import { errorText } from "../../../lib/errors.js";
import { createUser } from "../api.js";

export default function NewUserButton({ onDone }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      full_name: String(form.get("full_name")).trim(),
      email: String(form.get("email")).trim(),
      username: String(form.get("username")).trim(),
      password: String(form.get("password")),
    };

    setBusy(true);
    try {
      await createUser(payload);
      toast(`${payload.full_name || payload.username} can now sign in.`, "ok");
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
        New user
      </Button>
      {open && (
        <Modal title="New user" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit}>
            <Field label="Full name">
              <Input name="full_name" required />
            </Field>
            <div className="grid gap-x-3.5 sm:grid-cols-2">
              <Field label="Email">
                <Input name="email" type="email" required autoComplete="off" />
              </Field>
              <Field label="Username" hint="3 to 30 letters, numbers, _ or .">
                <Input
                  name="username"
                  required
                  pattern="[a-zA-Z0-9_.]{3,30}"
                  autoComplete="off"
                />
              </Field>
            </div>
            <Field
              label="Temporary password"
              hint="At least 8 characters, not only numbers, not a common password. Share it privately."
            >
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
                {busy ? "Creating…" : "Create user"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
