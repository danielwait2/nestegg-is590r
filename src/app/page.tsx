import Link from "next/link";
import ProjectionCard from "@/components/ProjectionCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      <Header>
        <Link href="/setup" className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
          Get Started →
        </Link>
      </Header>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
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
        </div>

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

        <div className="mt-12 text-center">
          <Link
            href="/setup"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Get started — it&apos;s free →
          </Link>
          <p className="text-sm text-gray-400 mt-3">Takes under 10 minutes. No account required.</p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
