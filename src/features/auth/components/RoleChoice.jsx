import Button from "../../../components/ui/Button.jsx";

const ROLE_NAMES = { super_admin: "Super Admin", admin: "Admin" };

// Shown after login when the person has two or more roles.
export default function RoleChoice({ roles, busy, error, onChoose, onCancel }) {
  return (
    <section className="flex w-full max-w-140 flex-col justify-center gap-5.5 px-5 py-7 md:px-11 md:py-12">
      <div>
        <h2 className="text-2xl font-semibold">Choose how to continue</h2>
        <p className="mt-1 text-ink-2">
          This account has more than one role. Pick one for this session.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-bad-wash px-3 py-2 text-bad">
          {error}
        </p>
      )}

      <div className="grid gap-2.5">
        {roles.map((role) => (
          <Button
            key={role}
            variant="primary"
            disabled={busy}
            onClick={() => onChoose(role)}
          >
            {ROLE_NAMES[role] ?? role}
          </Button>
        ))}
      </div>

      <Button variant="ghost" onClick={onCancel}>
        Use a different account
      </Button>
    </section>
  );
}
