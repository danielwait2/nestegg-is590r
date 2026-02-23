"use client";
import { useState, useEffect } from "react";
import { getProgress, setProgress } from "@/lib/storage";
import { trackEvent } from "@/lib/events";

export default function MarkAsDone({
  stepKey,
  onChecked,
}: {
  stepKey: "step1" | "step2" | "step3";
  onChecked?: (checked: boolean) => void;
}) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const progress = getProgress();
    setChecked(progress[stepKey] ?? false);
  }, [stepKey]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.checked;
    setChecked(val);
    const progress = getProgress();
    setProgress({ ...progress, [stepKey]: val });
    if (val) {
      trackEvent(`step_${stepKey === 'step1' ? '529' : stepKey === 'step2' ? 'utma' : 'credit'}_completed`);
    }
    onChecked?.(val);
  }

  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="w-5 h-5 accent-green-600 cursor-pointer"
      />
      <span className={`text-base font-medium ${checked ? "text-green-700" : "text-gray-700"}`}>
        {checked ? "Done ✓" : "Mark as done"}
      </span>
    </label>
  );
}
