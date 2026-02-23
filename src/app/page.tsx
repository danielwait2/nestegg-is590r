import ProjectionCard from "@/components/ProjectionCard";

export const metadata = {
  title: "NestEgg — Set Your Kids Up for Life",
  description: "Open a 529, UTMA, and authorized user credit card for your child in under 10 minutes.",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ monthly?: string; year?: string; name?: string; gift?: string }>;
}) {
  const params = await searchParams;
  const initialMonthly = params.monthly ? Number(params.monthly) : undefined;
  const initialBirthYear = params.year ? Number(params.year) : undefined;
  const childName = params.name ?? undefined;
  const isGift = params.gift === "1";

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isGift && childName
              ? `Help build ${childName}'s NestEgg`
              : "Set Your Kids Up for Life"}
          </h1>
          <p className="text-gray-500 text-lg">
            {isGift
              ? `See what a monthly contribution could grow into by ${childName ? `${childName}'s` : "their"} 18th birthday.`
              : "Open a 529, UTMA, and authorized user credit card for your child — in under 10 minutes."}
          </p>
        </header>

        <ProjectionCard
          initialMonthly={initialMonthly}
          initialBirthYear={initialBirthYear}
          childName={childName}
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { label: "529 Plan", desc: "Tax-advantaged education savings" },
            { label: "UTMA Account", desc: "Flexible investment in their name" },
            { label: "Credit History", desc: "Start building it today" },
          ].map((item) => (
            <div key={item.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="font-semibold text-gray-800">{item.label}</p>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-gray-100 py-6 px-4 mt-8">
        <p className="text-xs text-gray-400 text-center max-w-lg mx-auto">
          NestEgg is a financial education tool, not a registered investment adviser. This is not personalized financial advice.
        </p>
      </footer>
    </main>
  );
}
