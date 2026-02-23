"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import MarkAsDone from "@/components/MarkAsDone";
import IssuerInstructions from "@/components/IssuerInstructions";
import { getChild, getProgress } from "@/lib/storage";

export default function StepCreditPage() {
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
    setDone(progress.step3);
    setLoaded(true);
  }, [router]);

  if (!loaded) return null;

  return (
    <StepLayout step={3}>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Authorized User</h1>
      <p className="text-gray-600 mb-3">
        Add your child as an authorized user on your credit card — they never touch the card, but they start building a credit history today.
      </p>
      <p className="text-gray-500 text-sm mb-6">
        Credit history is built over time. Adding your child now means they could have 10+ years of history by the time they&apos;re 18 — giving them a head start most adults don&apos;t have.
      </p>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
        <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">What you&apos;ll need</p>
        <p className="text-sm text-gray-600">
          Log into your credit card account or call your issuer. You&apos;ll need your child&apos;s name and date of birth — Social Security number is often optional. Takes about 2 minutes.
        </p>
      </div>

      <div className="mb-6">
        <IssuerInstructions />
      </div>

      <div className="mb-6">
        <MarkAsDone stepKey="step3" onChecked={setDone} />
      </div>

      <button
        onClick={() => router.push("/setup/done")}
        className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors ${
          done
            ? "bg-gray-900 hover:bg-gray-800 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-600"
        }`}
      >
        {done ? "Finish →" : "Skip for now →"}
      </button>
    </StepLayout>
  );
}
