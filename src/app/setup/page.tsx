"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setChild } from "@/lib/storage";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { STATE_PLANS } from "@/data/statePlans";
import { trackEvent } from "@/lib/events";

const CURRENT_YEAR = new Date().getFullYear();
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function SetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthYear, setBirthYear] = useState(CURRENT_YEAR);
  const [state, setState] = useState("");

  const birthYearOptions = Array.from({ length: 4 }, (_, i) => CURRENT_YEAR - i);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !state) return;
    setChild({ name: name.trim(), birthYear, birthMonth, state });
    trackEvent('flow_started', { state });
    router.push("/setup/529");
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your child</h1>
          <p className="text-gray-500 mb-6">We&apos;ll personalize the recommendations to your state.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Child&apos;s first name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Emma"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth month</label>
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth year</label>
                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {birthYearOptions.map((y) => <option key={y} value={y}>{y === CURRENT_YEAR ? `${y} (just born)` : y}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Home state</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select your state...</option>
                {STATE_PLANS.map((p) => <option key={p.code} value={p.code}>{p.state}</option>)}
              </select>
            </div>

            <button
              type="submit"
              disabled={!name.trim() || !state}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Continue →
            </button>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
