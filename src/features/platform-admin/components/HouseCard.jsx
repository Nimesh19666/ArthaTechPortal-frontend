import Card from "../../../components/ui/Card.jsx";
import Chip from "../../../components/ui/Chip.jsx";
import Table, { TwoLine } from "../../../components/ui/Table.jsx";
import { formatShort } from "../../../lib/money.js";
import { FEATURE_LABELS, PROJECT_TYPES } from "../labels.js";
import RemoveButton from "./RemoveButton.jsx";

export default function HouseCard({ house, onChanged }) {
  const projectColumns = [
    {
      header: "Project",
      render: (p) => (
        <TwoLine main={p.name} sub={PROJECT_TYPES[p.type] ?? p.type} />
      ),
    },
    { header: "Teams", align: "right", render: (p) => p.teamCount },
    { header: "Records", align: "right", render: (p) => p.recordCount },
    {
      header: "",
      align: "right",
      render: (p) => (
        <RemoveButton
          type="project"
          id={p.id}
          name={p.name}
          hint="Works only if the project has no teams and no spending."
          onDone={onChanged}
        />
      ),
    },
  ];

  const plan = house.planName
    ? `${house.planName} plan · ${formatShort(house.planPricePaise)}`
    : "No plan";

  return (
    <Card
      title={house.name}
      subtitle={`${plan} · ${house.userCount} users`}
      actions={
        <>
          {Object.entries(FEATURE_LABELS)
            .filter(([key]) => house.features[key])
            .map(([key, label]) => (
              <Chip key={key} tone="green">
                {label}
              </Chip>
            ))}
          <RemoveButton
            type="organisation"
            id={house.id}
            name={house.name}
            hint="Works only if the house has no projects and no logins."
            onDone={onChanged}
          />
        </>
      }
    >
      <Table
        columns={projectColumns}
        rows={house.projects}
        getKey={(p) => p.id}
        empty="No projects yet. Upload an Excel sheet, or create the house again with a first project."
      />
    </Card>
  );
}
