"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { calcProjection } from "@/lib/projection";
import { setProjection } from "@/lib/storage";
import ProjectionChart from "./ProjectionChart";
import { trackEvent } from "@/lib/events";

const CURRENT_YEAR = new Date().getFullYear();

function getYearsToGrow(birthYear: number) {
  const age = CURRENT_YEAR - birthYear;
  const years = 18 - age;
  return Math.max(years, 0);
}

export default function ProjectionCard({
  initialMonthly,
  initialBirthYear,
  childName,
}: {
  initialMonthly?: number;
  initialBirthYear?: number;
  childName?: string;
}) {
  const router = useRouter();
  const [monthly, setMonthly] = useState(initialMonthly ?? 50);
  const [birthYear, setBirthYear] = useState(initialBirthYear ?? CURRENT_YEAR);
  const [hasTracked, setHasTracked] = useState(false);

  const yearsToGrow = getYearsToGrow(birthYear);
  const projected = Math.round(calcProjection(monthly, yearsToGrow));

  function handleSliderChange(val: number) {
    setMonthly(val);
    if (!hasTracked) {
      setHasTracked(true);
      trackEvent('projection_interacted', { monthly: val });
    }
  }

  function handleCTA() {
    setProjection({ monthlyAmount: monthly, birthYear });
    router.push("/setup");
  }

  // Birth year options: current year back 2 years
  const birthYearOptions = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

  const nameLabel = childName ? `${childName}'s 18th birthday` : "your child's 18th birthday";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5 max-w-lg mx-auto">
      <div>
        <p className="text-sm text-gray-500 mb-1">Monthly contribution</p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={monthly}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="flex-1 accent-green-600"
          />
          <span className="text-lg font-bold text-gray-800 w-16 text-right">${monthly}</span>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-1">Child&apos;s birth year</p>
        <select
          value={birthYear}
          onChange={(e) => setBirthYear(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {birthYearOptions.map((y) => (
            <option key={y} value={y}>
              {y === CURRENT_YEAR ? `${y} (just born)` : y}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-green-50 rounded-xl p-4">
        <p className="text-sm text-gray-500">
          ${monthly}/month → <span className="text-2xl font-bold text-green-700">${projected.toLocaleString()}</span>
        </p>
        <p className="text-sm text-gray-500 mt-0.5">by {nameLabel}</p>
        {monthly > 0 && yearsToGrow > 0 && (
          <div className="text-xs text-gray-400 mt-1">
            At ${monthly + 25}/month → ${Math.round(calcProjection(monthly + 25, yearsToGrow)).toLocaleString()} — that&apos;s ${Math.round(calcProjection(monthly + 25, yearsToGrow) - projected).toLocaleString()} more
          </div>
        )}
      </div>

      {monthly > 0 && yearsToGrow > 0 && (
        <ProjectionChart monthlyAmount={monthly} yearsToGrow={yearsToGrow} />
      )}

      <p className="text-xs text-gray-400">
        Hypothetical illustration assuming 7% avg. annual return. Not a guarantee. Investment values fluctuate.
      </p>

      <button
        onClick={handleCTA}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        Set this up for free →
      </button>
    </div>
  );
}
