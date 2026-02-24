"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import MarkAsDone from "@/components/MarkAsDone";
import { getChild, getProgress } from "@/lib/storage";
import { getPlanForState } from "@/data/statePlans";

export default function Step529Page() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planUrl, setPlanUrl] = useState("");
  const [hasTaxDeduction, setHasTaxDeduction] = useState(false);
  const [deductionNote, setDeductionNote] = useState("");
  const [stateLabel, setStateLabel] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const child = getChild();
    if (!child) {
      router.replace("/setup");
      return;
    }
    const plan = getPlanForState(child.state);
    setPlanName(plan.planName);
    setPlanUrl(plan.planUrl);
    setHasTaxDeduction(plan.hasTaxDeduction);
    setDeductionNote(plan.deductionNote ?? "");
    setStateLabel(plan.state);
    const progress = getProgress();
    setDone(progress.step1);
    setLoaded(true);
  }, [router]);

  if (!loaded) return null;

  return (
    <StepLayout step={1}>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">529 Plan</h1>
      <p className="text-gray-600 mb-6">
        A tax-advantaged savings account for education — grows tax-free and withdraws tax-free for qualified expenses.
      </p>

      <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
        {hasTaxDeduction ? (
          <p className="text-sm text-gray-700">
            Good news — {stateLabel} offers a state tax deduction for contributions to{" "}
            <strong>{planName}</strong>.{deductionNote ? ` ${deductionNote}.` : ""}
          </p>
        ) : (
          <p className="text-sm text-gray-700">
            {stateLabel} doesn&apos;t offer a meaningful state tax deduction for 529 contributions, so we suggest{" "}
            <strong>{planName}</strong> — one of the lowest-fee plans in the country, open to all states.
          </p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
        <p className="text-xs text-blue-700 font-medium mb-2 uppercase tracking-wide">Good to know</p>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Works for trade schools, vocational programs, and IT certifications — not just 4-year colleges.</li>
          <li>If your child doesn&apos;t pursue education, the money doesn&apos;t disappear — it stays in the account and keeps growing. You&apos;d just owe taxes on the gains if withdrawn for non-education use (like a regular investment).</li>
          <li>After 15 years, unused 529 funds can be rolled over into a Roth IRA in your child&apos;s name (up to $35,000 lifetime, subject to annual Roth IRA contribution limits). A great backup plan if education expenses come in under budget.</li>
        </ul>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4">
        <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">What you&apos;ll need</p>
        <p className="text-sm text-gray-600">
          Your Social Security number, your child&apos;s SSN (you can add it later if you don&apos;t have it), and a bank account to fund the plan. Takes about 5 minutes.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          NestEgg never stores your SSN — you enter it directly on the plan&apos;s official site.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
        <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">What to expect on the site</p>
        <p className="text-sm text-gray-600">
          You&apos;ll create an account, enter beneficiary info (your child), choose a contribution amount and investment option. Ignore anything about employer plans or rollovers — those don&apos;t apply here.
        </p>
      </div>

      <a
        href={planUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors mb-6"
      >
        Open {planName} →
      </a>

      <div className="mb-6">
        <MarkAsDone stepKey="step1" onChecked={setDone} />
      </div>

      <div className="border-t border-gray-100 pt-6 mb-6">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-4">Common questions</p>
        <div className="space-y-4">
          {[
            { q: "Does a 529 only cover 4-year colleges?", a: "No — it covers trade schools, community college, vocational programs, and IT certifications too. As long as the institution is accredited, qualified expenses are covered." },
            { q: "What if my child doesn't pursue any education?", a: "The money stays in the account and keeps growing. You can withdraw it for any reason, but gains on non-education withdrawals are subject to income tax. After 15 years, you can also roll unused funds into a Roth IRA in your child's name (up to $35,000 lifetime) — turning leftover education savings into a retirement head start." },
            { q: "Can I change my contribution later?", a: "Yes. You can increase, decrease, or pause contributions at any time. There's no minimum ongoing contribution." },
            { q: "Why are you recommending this specific plan?", a: hasTaxDeduction ? `${stateLabel} offers a state tax deduction for contributions to ${planName}, which means you get a direct tax benefit for contributing. That makes it the clear first choice for residents.` : `${stateLabel} doesn't offer a meaningful state tax deduction, so we suggest ${planName} — it consistently ranks as one of the lowest-fee 529 plans in the country and is open to all states.` },
          ].map((item) => (
            <div key={item.q}>
              <p className="text-sm font-semibold text-gray-800 mb-1">{item.q}</p>
              <p className="text-sm text-gray-500">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => router.push("/setup/utma")}
        className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors ${
          done
            ? "bg-gray-900 hover:bg-gray-800 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-600"
        }`}
      >
        {done ? "Continue →" : "Skip for now →"}
      </button>
    </StepLayout>
  );
}
