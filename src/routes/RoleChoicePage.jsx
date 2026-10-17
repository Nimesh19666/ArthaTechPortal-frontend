import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleChoice from "../features/auth/components/RoleChoice.jsx";
import { availableRoles } from "../features/auth/roles.js";
import { useAuth } from "../features/auth/useAuth.js";
import { roleHome } from "./roleHome.js";

// Shown instead of every screen while a person with two or more roles has not chosen one.
export default function RoleChoicePage() {
  const { user, chooseRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleChoose(role) {
    setError("");
    setBusy(true);
    try {
      await chooseRole(role);
      navigate(roleHome(user), { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-full place-items-center bg-canvas">
      <RoleChoice
        roles={availableRoles(user)}
        busy={busy}
        error={error}
        onChoose={handleChoose}
        onCancel={signOut}
      />
    </div>
  );
}
