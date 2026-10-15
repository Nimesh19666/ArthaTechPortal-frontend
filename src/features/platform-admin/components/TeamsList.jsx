import Chip from "../../../components/ui/Chip.jsx";
import RemoveAllButton from "./RemoveAllButton.jsx";
import RemoveButton from "./RemoveButton.jsx";

export default function TeamsList({ projects, onChanged }) {
  const withTeams = projects.filter((p) => p.teams.length > 0);
  if (withTeams.length === 0) return null;

  return (
    <div className="grid gap-4 border-t border-line px-4.5 py-3.5 text-sm">
      {withTeams.map((project) => (
        <div key={project.id}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <b>{project.name}</b>
            <RemoveAllButton
              kind="teams"
              parentId={project.id}
              label="Remove all teams"
              what={`all teams of ${project.name}`}
              onDone={onChanged}
            />
          </div>
          <div className="mt-2 grid gap-3">
            {project.teams.map((team) => (
              <div key={team.id} className="rounded-lg border border-line p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <b>{team.name}</b>
                  <span className="flex flex-wrap gap-2">
                    {team.members.length > 0 && (
                      <RemoveAllButton
                        kind="members"
                        parentId={team.id}
                        label="Remove all people"
                        what={`all people of ${team.name}`}
                        onDone={onChanged}
                      />
                    )}
                    <RemoveButton
                      type="team"
                      id={team.id}
                      name={team.name}
                      hint="Works only if the team has no people."
                      onDone={onChanged}
                    />
                  </span>
                </div>
                {team.members.length === 0 ? (
                  <p className="mt-1 text-brand-soft">No people yet.</p>
                ) : (
                  <ul className="mt-2 grid gap-1.5">
                    {team.members.map((member) => (
                      <li
                        key={member.id}
                        className="flex flex-wrap items-center justify-between gap-2"
                      >
                        <span className="flex flex-wrap items-center gap-2">
                          {member.name}
                          {member.phone && (
                            <span className="text-brand-soft">
                              {member.phone}
                            </span>
                          )}
                          {member.isTeamHead && (
                            <Chip tone="blue">Team head</Chip>
                          )}
                          {!member.isActive && (
                            <Chip tone="grey">Switched off</Chip>
                          )}
                        </span>
                        <RemoveButton
                          type="member"
                          id={member.id}
                          name={member.name}
                          hint="The person is removed from the team."
                          onDone={onChanged}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
