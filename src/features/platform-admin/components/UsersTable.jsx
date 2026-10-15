import Card from "../../../components/ui/Card.jsx";
import Chip from "../../../components/ui/Chip.jsx";
import Table, { TwoLine } from "../../../components/ui/Table.jsx";
import ResetPasswordButton from "./ResetPasswordButton.jsx";
import ToggleActiveButton from "./ToggleActiveButton.jsx";

export default function UsersTable({ users, onChanged }) {
  const columns = [
    {
      header: "Name",
      render: (u) => <TwoLine main={u.full_name || u.username} sub={u.email} />,
    },
    { header: "Username", render: (u) => u.username },
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
            <ToggleActiveButton user={u} name={name} onDone={onChanged} />
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
