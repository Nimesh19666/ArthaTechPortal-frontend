import Async from "../../../components/ui/Async.jsx";
import PageHead from "../../../components/ui/PageHead.jsx";
import { useLoad } from "../../../lib/useLoad.js";
import { getHouses } from "../api.js";
import HouseCard from "./HouseCard.jsx";
import NewHouseButton from "./NewHouseButton.jsx";
import UploadExcelButton from "./UploadExcelButton.jsx";

export default function HousesPanel() {
  const state = useLoad(getHouses);

  return (
    <>
      <PageHead
        title="Production houses"
        text="Create houses with their plan and features, and fill projects, teams and people with the Excel upload."
        actions={
          <>
            <UploadExcelButton onDone={state.reload} />
            <NewHouseButton onDone={state.reload} />
          </>
        }
      />
      <Async state={state}>
        {(houses) =>
          houses.length === 0 ? (
            <p className="rounded-[10px] border border-line bg-white px-4.5 py-6.5 text-center text-brand-soft">
              No production houses yet. Create the first one.
            </p>
          ) : (
            <div className="grid gap-4.5">
              {houses.map((house) => (
                <HouseCard
                  key={house.id}
                  house={house}
                  onChanged={state.reload}
                />
              ))}
            </div>
          )
        }
      </Async>
    </>
  );
}
