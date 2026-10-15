import { useState } from "react";
import { useToast } from "../../../components/ui/useToast.js";
import { errorText } from "../../../lib/errors.js";
import { updateHouse } from "../api.js";
import { FEATURE_FIELDS, FEATURE_LABELS } from "../labels.js";

export default function FeatureSwitches({ house, onDone }) {
  const toast = useToast();
  const [busyKey, setBusyKey] = useState(null);

  async function toggle(key, value) {
    setBusyKey(key);
    try {
      await updateHouse(house.id, { [FEATURE_FIELDS[key]]: value });
      onDone();
    } catch (error) {
      toast(errorText(error), "bad");
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 border-b border-line px-4.5 py-3 text-sm">
      {Object.entries(FEATURE_LABELS).map(([key, label]) => (
        <label key={key} className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={house.features[key]}
            disabled={busyKey === key}
            onChange={(e) => toggle(key, e.target.checked)}
          />
          {label}
        </label>
      ))}
    </div>
  );
}
