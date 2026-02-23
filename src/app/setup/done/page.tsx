"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getChild, getProgress, getProjection } from "@/lib/storage";
import { calcProjection } from "@/lib/projection";
import { getPlanForState } from "@/data/statePlans";

const CURRENT_YEAR = new Date().getFullYear();

export default function DonePage() {
  const [loaded, setLoaded] = useState(false);
  const [childName, setChildName] = useState("your child");
  const [planName, setPlanName] = useState("529 Plan");
  const [issuer, setIssuer] = useState("your card");
  const [projected, setProjected] = useState(0);
  const [monthly, setMonthly] = useState(50);
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);
  const [shareMsg, setShareMsg] = useState("");

  useEffect(() => {
    const child = getChild();
    const progress = getProgress();
    const projection = getProjection();

    if (child) {
      setChildName(child.name);
      const plan = getPlanForState(child.state);
      setPlanName(plan.planName);
    }

    if (progress.issuer) setIssuer(progress.issuer);
    setStep1Done(progress.step1);
    setStep2Done(progress.step2);
    setStep3Done(progress.step3);

    const monthlyAmt = projection?.monthlyAmount ?? 50;
    const birthYear = projection?.birthYear ?? child?.birthYear ?? CURRENT_YEAR;
    const years = Math.max(18 - (CURRENT_YEAR - birthYear), 0);
    setMonthly(monthlyAmt);
    setProjected(Math.round(calcProjection(monthlyAmt, years)));
    setLoaded(true);
  }, []);

  function generateShareUrl(gift = false) {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin;
    const params = new URLSearchParams();
    if (monthly) params.set("monthly", String(monthly));
    const child = getChild();
    if (child?.birthYear) params.set("year", String(child.birthYear));
    if (child?.name) params.set("name", child.name);
    if (gift) params.set("gift", "1");
    return `${base}?${params.toString()}`;
  }

  async function handleShare() {
    const url = generateShareUrl(false);
    try {
      await navigator.clipboard.writeText(url);
      setShareMsg("Link copied!");
    } catch {
      setShareMsg(url);
    }
    setTimeout(() => setShareMsg(""), 3000);
  }

  async function handleGift() {
    const url = generateShareUrl(true);
    try {
      await navigator.clipboard.writeText(url);
      setShareMsg("Gift link copied!");
    } catch {
      setShareMsg(url);
    }
    setTimeout(() => setShareMsg(""), 3000);
  }

  if (!loaded) return null;

  const allDone = step1Done && step2Done && step3Done;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <header className="px-4 py-4 border-b border-gray-100">
        <Link href="/" className="text-lg font-semibold text-green-700">NestEgg</Link>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {allDone ? `${childName}'s financial foundation is set.` : "Here's where you are."}
          </h1>
          {allDone && (
            <p className="text-gray-500 mb-8">All three accounts are done. You did the hardest part — getting started.</p>
          )}

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6 space-y-4">
            {[
              { done: step1Done, label: "529 Plan", sub: planName },
              { done: step2Done, label: "UTMA Account", sub: "Fidelity Custodial" },
              { done: step3Done, label: "Authorized User", sub: issuer !== "your card" ? issuer : "Credit card" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${item.done ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                  {item.done ? "✓" : "–"}
                </div>
                <div>
                  <p className={`font-medium ${item.done ? "text-gray-900" : "text-gray-400"}`}>{item.label}</p>
                  <p className="text-sm text-gray-400">{item.sub}</p>
                </div>
                {!item.done && (
                  <span className="ml-auto text-xs text-orange-500 font-medium">Still to do</span>
                )}
              </div>
            ))}
          </div>

          {projected > 0 && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500">
                ${monthly}/month, starting today →{" "}
                <span className="text-xl font-bold text-green-700">${projected.toLocaleString()}</span>
              </p>
              <p className="text-sm text-gray-400 mt-0.5">by {childName}&apos;s 18th birthday</p>
              <p className="text-xs text-gray-400 mt-2">
                Hypothetical illustration assuming 7% avg. annual return. Not a guarantee. Investment values fluctuate.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleShare}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Share with your partner →
            </button>
            <button
              onClick={handleGift}
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Send as a baby gift →
            </button>
            {shareMsg && (
              <p className="text-center text-sm text-green-600">{shareMsg}</p>
            )}
          </div>
        </div>
      </main>

      <footer className="px-4 py-6 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-400 text-center max-w-lg mx-auto">
          NestEgg is a financial education tool, not a registered investment adviser. This is not personalized financial advice.
        </p>
      </footer>
    </div>
  );
}
