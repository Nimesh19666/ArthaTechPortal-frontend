import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../components/ui/useToast.js";
import { errorText } from "../../../lib/errors.js";
import { availableRoles } from "../roles.js";
import { useAuth } from "../useAuth.js";

const ROLE_NAMES = { super_admin: "Super Admin", admin: "Admin" };

export default function SwitchRole() {
  const { user, role, chooseRole } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const roles = availableRoles(user);
  if (roles.length < 2) return null;

  async function handleClick(nextRole) {
    if (nextRole === role) return;
    setBusy(true);
    try {
      await chooseRole(nextRole);
      navigate("/admin", { replace: true }); // the new role may not see the current page
    } catch (err) {
      toast(errorText(err), "bad");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="group"
      aria-label="Switch role"
      className="inline-flex rounded-lg border border-line bg-white p-0.5 text-[13px] font-semibold"
    >
      {roles.map((r) => (
        <button
          key={r}
          type="button"
          disabled={busy}
          aria-pressed={r === role}
          onClick={() => handleClick(r)}
          className={`cursor-pointer rounded-md px-2.5 py-1 disabled:cursor-not-allowed ${
            r === role ? "bg-brand text-white" : "text-ink-2 hover:bg-panel"
          }`}
        >
          {ROLE_NAMES[r] ?? r}
        </button>
      ))}
    </div>
  );
}
