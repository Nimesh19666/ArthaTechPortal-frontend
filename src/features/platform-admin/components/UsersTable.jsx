import Card from "../../../components/ui/Card.jsx";
import Chip from "../../../components/ui/Chip.jsx";
import Table, { TwoLine } from "../../../components/ui/Table.jsx";
import { getRole } from "../../../lib/roleStore.js";
import { USER_ROLES } from "../labels.js";
import { canDeactivate } from "../permissions.js";
import ResetPasswordButton from "./ResetPasswordButton.jsx";
import ToggleActiveButton from "./ToggleActiveButton.jsx";

export default function UsersTable({ users, onChanged }) {
  const myRole = getRole();

  const columns = [
    {
      header: "Name",
      render: (u) => <TwoLine main={u.full_name || u.username} sub={u.email} />,
    },
    { header: "Username", render: (u) => u.username },
    {
      header: "Role",
      render: (u) => {
        const roles = u.roles ?? (u.role ? [u.role] : []);
        if (roles.length === 0) return "—";
        return (
          <span className="flex flex-wrap gap-1">
            {roles.map((r) => (
              <Chip key={r} tone={r === "normal_user" ? "grey" : "blue"}>
                {USER_ROLES[r] ?? r}
              </Chip>
            ))}
          </span>
        );
      },
    },
    {
      header: "Status",
      render: (u) =>
        u.is_active ? (
          <Chip tone="green">Active</Chip>
        ) : (
          <Chip tone="red">Deactivated</Chip>
        ),
    },
    {
      header: "",
      align: "right",
      render: (u) => {
        const name = u.full_name || u.username;
        return (
          <span className="inline-flex gap-1.5">
            <ResetPasswordButton user={u} name={name} />
            {canDeactivate(myRole, u) && (
              <ToggleActiveButton user={u} name={name} onDone={onChanged} />
            )}
          </span>
        );
      },
    },
  ];

  return (
    <Card>
      <Table
        columns={columns}
        rows={users}
        getKey={(u) => u.id}
        empty="No users found."
      />
    </Card>
  );
}
