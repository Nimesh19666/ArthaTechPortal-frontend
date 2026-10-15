import StatCard from "../../../components/ui/StatCard.jsx";
import { formatShort } from "../../../lib/money.js";

export default function OverviewStats({ houses }) {
  const projectCount = houses.reduce((sum, h) => sum + h.projects.length, 0);
  const userCount = houses.reduce((sum, h) => sum + h.userCount, 0);
  const planValue = houses.reduce((sum, h) => sum + h.planPricePaise, 0);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3.5">
      <StatCard label="Production houses" value={houses.length} />
      <StatCard
        label="Projects"
        value={projectCount}
        note="Across all houses"
      />
      <StatCard label="Users" value={userCount} note="Across all houses" />
      <StatCard
        hero
        label="Plan value"
        value={formatShort(planValue)}
        note="Sum of all plan prices"
      />
    </div>
  );
}
