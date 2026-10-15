import { useState } from "react";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import { Field, Input, Select } from "../../../components/ui/Field.jsx";
import { useToast } from "../../../components/ui/useToast.js";
import { errorText } from "../../../lib/errors.js";
import { addItems } from "../api.js";
import { PROJECT_TYPES, toOptions } from "../labels.js";

const WHAT = [
  ["project", "A project"],
  ["team", "A team"],
  ["person", "A person"],
];

// The server matches an existing project or team by its name.
function buildPayload(f, teamName) {
  if (f.what === "project") {
    return [{ name: f.project.trim(), project_type: f.type }];
  }
  if (f.what === "team") {
    return [{ name: f.existingProject, teams: [{ name: f.team.trim() }] }];
  }
  const person = { name: f.person.trim(), is_team_head: f.head };
  if (f.phone.trim()) person.phone = f.phone.trim();
  return [
    {
      name: f.existingProject,
      teams: [{ name: teamName, members: [person] }],
    },
  ];
}

export default function AddItemsButton({ house, onDone }) {
  const toast = useToast();
  const firstProject = house.projects[0]?.name ?? "";
  const blank = {
    what: "project",
    project: "",
    type: "movie",
    existingProject: firstProject,
    team: "",
    person: "",
    phone: "",
    head: false,
  };
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(blank);
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) =>
    setF({
      ...f,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  const projectOptions = house.projects.map((p) => [p.name, p.name]);
  const needsProject = f.what !== "project";

  // Teams of the chosen project, for the person form.
  const chosenProject = house.projects.find(
    (p) => p.name === f.existingProject,
  );
  const teamOptions = (chosenProject?.teams ?? []).map((t) => [t.name, t.name]);
  const teamValue = teamOptions.some(([name]) => name === f.team)
    ? f.team
    : (teamOptions[0]?.[0] ?? "");

  const noProject = needsProject && projectOptions.length === 0;
  const noTeam = f.what === "person" && teamOptions.length === 0;

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await addItems(house.id, buildPayload(f, teamValue));
      toast("Saved.", "ok");
      setOpen(false);
      setF(blank);
      onDone();
    } catch (error) {
      toast(errorText(error), "bad");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        size="small"
        onClick={() => {
          setF(blank);
          setOpen(true);
        }}
      >
        Add
      </Button>
      {open && (
        <Modal title={`Add to ${house.name}`} onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit}>
            <Field label="What do you want to add?">
              <Select options={WHAT} value={f.what} onChange={set("what")} />
            </Field>

            {f.what === "project" && (
              <>
                <Field label="Project name">
                  <Input required value={f.project} onChange={set("project")} />
                </Field>
                <Field label="Type">
                  <Select
                    options={toOptions(PROJECT_TYPES)}
                    value={f.type}
                    onChange={set("type")}
                  />
                </Field>
              </>
            )}

            {needsProject &&
              (noProject ? (
                <p className="mb-3 text-sm text-bad">Add a project first.</p>
              ) : (
                <Field label="Project">
                  <Select
                    options={projectOptions}
                    value={f.existingProject}
                    onChange={(e) =>
                      setF({ ...f, existingProject: e.target.value, team: "" })
                    }
                  />
                </Field>
              ))}

            {f.what === "team" && !noProject && (
              <Field label="New team name">
                <Input required value={f.team} onChange={set("team")} />
              </Field>
            )}

            {f.what === "person" &&
              !noProject &&
              (noTeam ? (
                <p className="mb-3 text-sm text-bad">
                  This project has no team yet. Add a team first.
                </p>
              ) : (
                <>
                  <Field label="Team">
                    <Select
                      options={teamOptions}
                      value={teamValue}
                      onChange={set("team")}
                    />
                  </Field>
                  <Field label="Person name">
                    <Input required value={f.person} onChange={set("person")} />
                  </Field>
                  <Field label="Phone (optional)">
                    <Input
                      value={f.phone}
                      onChange={set("phone")}
                      inputMode="tel"
                    />
                  </Field>
                  <label className="mb-3 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={f.head}
                      onChange={set("head")}
                    />{" "}
                    Team head
                  </label>
                </>
              ))}

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={busy || noProject || noTeam}
              >
                {busy ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
