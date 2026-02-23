"use client";
import { useState } from "react";
import { ISSUER_INSTRUCTIONS } from "@/data/issuerInstructions";
import { getProgress, setProgress } from "@/lib/storage";

export default function IssuerInstructions() {
  const [selectedIssuer, setSelectedIssuer] = useState<string>("");

  function handleSelect(issuer: string) {
    setSelectedIssuer(issuer);
    // Store issuer selection in progress
    const progress = getProgress();
    setProgress({ ...progress, issuer });
  }

  const instructions = ISSUER_INSTRUCTIONS.find(i => i.issuer === selectedIssuer);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your card issuer</label>
        <select
          value={selectedIssuer}
          onChange={(e) => handleSelect(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select your issuer...</option>
          {ISSUER_INSTRUCTIONS.map((i) => (
            <option key={i.issuer} value={i.issuer}>{i.issuer}</option>
          ))}
        </select>
      </div>

      {instructions && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 space-y-3">
          <ol className="space-y-2">
            {instructions.steps.map((step, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {instructions.note && (
            <p className="text-xs text-gray-500 pt-1 border-t border-green-100">{instructions.note}</p>
          )}
        </div>
      )}
    </div>
  );
}
