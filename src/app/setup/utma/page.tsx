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

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
        <p className="text-xs text-blue-700 font-medium mb-2 uppercase tracking-wide">Why both a 529 and a UTMA?</p>
        <p className="text-sm text-gray-700">
          The 529 is tax-optimized for education. The UTMA is the backstop — no restrictions on how your child uses it. If they start a business, buy a house, or skip school entirely, this money is still theirs. Most families contribute less here and more to the 529.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4">
        <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">What you&apos;ll need</p>
        <p className="text-sm text-gray-600">
          Your Social Security number and your child&apos;s date of birth. No account minimum. Takes about 5 minutes.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          NestEgg never stores your SSN — you enter it directly on Fidelity&apos;s site.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
        <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">What to expect on the site</p>
        <p className="text-sm text-gray-600">
          Select &quot;Custodial Account (UTMA/UGMA)&quot; when prompted for account type. You&apos;ll enter your info as custodian and your child&apos;s info as the minor. You can fund it later — no minimum required to open.
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

      <div className="border-t border-gray-100 pt-6 mb-6">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-4">Common questions</p>
        <div className="space-y-4">
          {[
            { q: "What's the difference between UTMA and UGMA?", a: "UTMA (Uniform Transfers to Minors Act) is available in most states and supports a wider range of assets including real estate. UGMA (Uniform Gift to Minors Act) supports financial assets only. Fidelity uses UTMA/UGMA interchangeably — for most families, there's no practical difference." },
            { q: "When does my child get control of the account?", a: "At the age of majority in your state — typically 18 or 21. At that point, the account transfers to them and they can use it for anything." },
            { q: "Is the UTMA better than the 529?", a: "They serve different purposes. The 529 is tax-optimized specifically for education. The UTMA is more flexible but doesn't have tax advantages. Most families treat the 529 as primary and the UTMA as a backstop." },
            { q: "Do I have to fund it right away?", a: "No. You can open the account today with no money and fund it whenever you're ready. The important thing is to get the account open so the clock starts." },
          ].map((item) => (
            <div key={item.q}>
              <p className="text-sm font-semibold text-gray-800 mb-1">{item.q}</p>
              <p className="text-sm text-gray-500">{item.a}</p>
            </div>
          ))}
        </div>
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
