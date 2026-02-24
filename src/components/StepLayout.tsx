"use client";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function StepLayout({
  step,
  children,
}: {
  step: 1 | 2 | 3;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold
                  ${s < step ? "bg-green-600 text-white" : s === step ? "bg-green-700 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {s < step ? "✓" : s}
              </div>
              {s < 3 && <div className={`h-0.5 w-8 ${s < step ? "bg-green-600" : "bg-gray-200"}`} />}
            </div>
          ))}
          <span className="ml-2 text-sm text-gray-500">Step {step} of 3</span>
        </div>
      </div>
      <main className="flex-1 px-4 py-8">
        <div className="max-w-lg mx-auto">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
