import Async from "../../../components/ui/Async.jsx";
import { useLoad } from "../../../lib/useLoad.js";
import { getHouses } from "../api.js";
import HousesSummaryTable from "./HousesSummaryTable.jsx";
import OverviewStats from "./OverviewStats.jsx";

export default function PlatformOverview() {
  const state = useLoad(getHouses);

  return (
    <Async state={state}>
      {(houses) => (
        <>
          <OverviewStats houses={houses} />
          <HousesSummaryTable houses={houses} />
        </>
      )}
    </Async>
  );
}
