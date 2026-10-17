import { useState } from "react";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import { Field, Input, Select } from "../../../components/ui/Field.jsx";
import { useToast } from "../../../components/ui/useToast.js";
import { errorText } from "../../../lib/errors.js";
import { getRole } from "../../../lib/roleStore.js";
import { createUser } from "../api.js";
import { USER_ROLES } from "../labels.js";
import { creatableRoles } from "../permissions.js";

export default function NewUserButton({ onDone }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // A super admin can give all three roles. An admin cannot give super_admin.
  const roleOptions = creatableRoles(getRole()).map((r) => [r, USER_ROLES[r]]);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get("email")).trim(),
      username: String(form.get("username")).trim(),
      password: String(form.get("password")),
      role: form.get("role"),
    };
    const fullName = String(form.get("full_name")).trim();
    if (fullName) payload.full_name = fullName;

    setBusy(true);
    try {
      const result = await createUser(payload);
      // The backend adds the role if the email already exists with another role.
      toast(result.message ?? "User created.", "ok");
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
            <Field label="Full name (optional)">
              <Input name="full_name" autoComplete="off" />
            </Field>
            <div className="grid gap-x-3.5 sm:grid-cols-2">
              <Field label="Email">
                <Input name="email" type="email" required autoComplete="off" />
              </Field>
              <Field label="Username">
                <Input name="username" required autoComplete="off" />
              </Field>
            </div>
            <div className="grid gap-x-3.5 sm:grid-cols-2">
              <Field label="Role">
                <Select
                  name="role"
                  options={roleOptions}
                  defaultValue="normal_user"
                />
              </Field>
              <Field label="Password" hint="The server rejects weak passwords.">
                <Input
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                />
              </Field>
            </div>
            <div className="mt-2 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={busy || roleOptions.length === 0}
              >
                {busy ? "Creating…" : "Create user"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
