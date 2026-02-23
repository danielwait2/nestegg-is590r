"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import MarkAsDone from "@/components/MarkAsDone";
import { getChild, getProgress } from "@/lib/storage";

export default function StepUtmaPage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const child = getChild();
    if (!child) {
      router.replace("/setup");
      return;
    }
    const progress = getProgress();
    setDone(progress.step2);
    setLoaded(true);
  }, [router]);

  if (!loaded) return null;

  return (
    <StepLayout step={2}>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">UTMA Custodial Account</h1>
      <p className="text-gray-600 mb-3">
        A flexible investment account in your child&apos;s name — no restrictions on what it&apos;s used for.
      </p>
      <p className="text-gray-500 text-sm mb-6">
        The 529 is optimized for college. The UTMA is a backstop — if your child starts a business, buys a house, or skips college, this money is still theirs.
      </p>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
        <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">What you&apos;ll need</p>
        <p className="text-sm text-gray-600">
          Your Social Security number and your child&apos;s date of birth. No account minimum. Takes about 5 minutes.
        </p>
      </div>

      <a
        href="https://www.fidelity.com/open-account/custodial-account"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors mb-6"
      >
        Open Fidelity Custodial Account →
      </a>

      <div className="mb-6">
        <MarkAsDone stepKey="step2" onChecked={setDone} />
      </div>

      <button
        onClick={() => router.push("/setup/credit")}
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
