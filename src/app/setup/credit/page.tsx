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

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4">
        <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">What you&apos;ll need</p>
        <p className="text-sm text-gray-600">
          Log into your credit card account or call your issuer. You&apos;ll need your child&apos;s name and date of birth — Social Security number is often optional. Takes about 2 minutes.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
        <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">What to expect</p>
        <p className="text-sm text-gray-600">
          Look for &quot;Add authorized user&quot; in your account settings or card management page. Your child won&apos;t receive a card — or you can choose not to activate it. They build credit history just by being listed.
        </p>
      </div>

      <div className="mb-6">
        <IssuerInstructions />
      </div>

      <div className="mb-6">
        <MarkAsDone stepKey="step3" onChecked={setDone} />
      </div>

      <div className="border-t border-gray-100 pt-6 mb-6">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-4">Common questions</p>
        <div className="space-y-4">
          {[
            { q: "Will my child get a physical card?", a: "Some issuers automatically send one; others let you opt out. Either way, your child doesn't need to use it — credit history is built just from being listed on the account, regardless of whether a card is ever used." },
            { q: "Does this affect my credit score?", a: "Adding an authorized user typically has no negative effect on your credit score. It may actually help your child's future credit profile by establishing a long history of on-time payments." },
            { q: "What if I don't have a credit card?", a: "This step is optional. If you don't have a credit card or prefer not to add your child, skip it — the 529 and UTMA are the higher-priority accounts anyway." },
            { q: "Does my child need a Social Security number for this?", a: "Often, no — most issuers only require your child's name and date of birth to add them as an authorized user. An SSN is sometimes optional and helps the issuer report the account to credit bureaus under your child's name." },
          ].map((item) => (
            <div key={item.q}>
              <p className="text-sm font-semibold text-gray-800 mb-1">{item.q}</p>
              <p className="text-sm text-gray-500">{item.a}</p>
            </div>
          ))}
        </div>
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
