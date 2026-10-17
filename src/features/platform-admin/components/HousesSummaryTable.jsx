import Card from "../../../components/ui/Card.jsx";
import Chip from "../../../components/ui/Chip.jsx";
import Table from "../../../components/ui/Table.jsx";

export default function HousesSummaryTable({ houses }) {
  const columns = [
    {
      header: "House",
      render: (h) => <b className="font-semibold">{h.name}</b>,
    },
    {
      header: "Status",
      render: (h) =>
        h.isSuspended ? (
          <Chip tone="red">Suspended</Chip>
        ) : (
          <Chip tone="green">Active</Chip>
        ),
    },
    { header: "Projects", align: "right", render: (h) => h.projects.length },
    { header: "Users", align: "right", render: (h) => h.userCount },
  ];

  return (
    <Card title="Production houses">
      <Table
        columns={columns}
        rows={houses}
        getKey={(h) => h.id}
        empty="No production houses yet."
      />
    </Card>
  );
}
