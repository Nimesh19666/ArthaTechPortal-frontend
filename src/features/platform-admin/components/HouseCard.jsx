import Card from "../../../components/ui/Card.jsx";
import Chip from "../../../components/ui/Chip.jsx";
import Table, { TwoLine } from "../../../components/ui/Table.jsx";
import { PROJECT_TYPES } from "../labels.js";
import AddItemsButton from "./AddItemsButton.jsx";
import RemoveAllButton from "./RemoveAllButton.jsx";
import RemoveButton from "./RemoveButton.jsx";
import SuspendButton from "./SuspendButton.jsx";
import TeamsList from "./TeamsList.jsx";

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

  const subtitle = `${house.userCount} users${
    house.isSuspended && house.suspendedReason
      ? ` · Suspended: ${house.suspendedReason}`
      : ""
  }`;

  return (
    <Card
      title={house.name}
      subtitle={subtitle}
      actions={
        <>
          {house.isSuspended && <Chip tone="red">Suspended</Chip>}
          <AddItemsButton house={house} onDone={onChanged} />
          <SuspendButton house={house} onDone={onChanged} />
          {house.projects.length > 0 && (
            <RemoveAllButton
              kind="projects"
              parentId={house.id}
              label="Remove all projects"
              what={`all projects of ${house.name}`}
              onDone={onChanged}
            />
          )}
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
        empty="No projects yet. Use Add to create the first one."
      />
      <TeamsList projects={house.projects} onChanged={onChanged} />
    </Card>
  );
}
