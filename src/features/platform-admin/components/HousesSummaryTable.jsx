import Card from "../../../components/ui/Card.jsx";
import Table, { TwoLine } from "../../../components/ui/Table.jsx";
import { formatShort } from "../../../lib/money.js";

export default function HousesSummaryTable({ houses }) {
  const columns = [
    {
      header: "House",
      render: (h) => <b className="font-semibold">{h.name}</b>,
    },
    {
      header: "Plan",
      render: (h) =>
        h.planName ? (
          <TwoLine main={h.planName} sub={formatShort(h.planPricePaise)} />
        ) : (
          "—"
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
