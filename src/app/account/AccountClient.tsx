"use client";
import { useState } from "react";
import { calcProjection } from "@/lib/projection";

const CURRENT_YEAR = new Date().getFullYear();

export default function AccountClient({
  child,
}: {
  child: { name: string; birth_year: number; monthly_contribution: number };
}) {
  const [monthly, setMonthly] = useState(child.monthly_contribution);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const yearsToGrow = Math.max(18 - (CURRENT_YEAR - child.birth_year), 0);
  const projected = Math.round(calcProjection(monthly, yearsToGrow));

  async function handleSave() {
    setSaving(true);
    await fetch("/api/me/contribution", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthlyContribution: monthly }),
    });
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Monthly contribution</h2>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={monthly}
            onChange={(e) => { setMonthly(Number(e.target.value)); setSaved(false); }}
            className="flex-1 accent-green-600"
          />
          <span className="text-lg font-bold text-gray-800 w-16 text-right">${monthly}</span>
        </div>

        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">
            ${monthly}/month → <span className="text-2xl font-bold text-green-700">${projected.toLocaleString()}</span>
          </p>
          <p className="text-sm text-gray-400 mt-0.5">by {child.name}&apos;s 18th birthday</p>
        </div>

        <p className="text-xs text-gray-400">
          Hypothetical illustration assuming 7% avg. annual return. Not a guarantee. Investment values fluctuate.
        </p>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {saved ? "Saved ✓" : saving ? "Saving..." : "Save contribution →"}
        </button>
      </div>

      <form action="/api/auth/signout" method="POST">
        <button
          type="submit"
          className="w-full text-sm text-gray-400 hover:text-gray-600 py-2"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
