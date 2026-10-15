import { useState } from "react";
import Async from "../../../components/ui/Async.jsx";
import PageHead from "../../../components/ui/PageHead.jsx";
import { Input } from "../../../components/ui/Field.jsx";
import { useLoad } from "../../../lib/useLoad.js";
import { getUsers } from "../api.js";
import NewUserButton from "./NewUserButton.jsx";
import UsersTable from "./UsersTable.jsx";

function matches(user, search) {
  const text = `${user.full_name} ${user.username} ${user.email}`.toLowerCase();
  return text.includes(search.trim().toLowerCase());
}

export default function UsersPanel() {
  const state = useLoad(getUsers);
  const [search, setSearch] = useState("");

  return (
    <>
      <PageHead
        title="Users"
        text="Create users, reset passwords and switch accounts on or off. Reset by email is switched off for now, so you set a temporary password."
        actions={<NewUserButton onDone={state.reload} />}
      />
      <Input
        type="search"
        aria-label="Search users"
        placeholder="Search by name, username or email"
        className="max-w-80"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Async state={state}>
        {(users) => (
          <UsersTable
            users={users.filter((u) => matches(u, search))}
            onChanged={state.reload}
          />
        )}
      </Async>
    </>
  );
}
