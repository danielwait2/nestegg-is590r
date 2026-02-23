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
  const [childName, setChildName] = useState("");
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
    setChildName(child.name);
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

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
        <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">What you&apos;ll need</p>
        <p className="text-sm text-gray-600">
          Your Social Security number, your child&apos;s Social Security number (you can add it later if you don&apos;t have it yet), and a bank account to fund the plan. Takes about 5 minutes.
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
