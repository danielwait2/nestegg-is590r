import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "About — NestEgg",
  description: "Why NestEgg exists, how it works, and answers to common questions.",
};

const faqs = [
  {
    q: "Is NestEgg free?",
    a: "Yes. NestEgg is a free educational tool. We don't charge for the guided setup, and we don't take commissions on any accounts you open.",
  },
  {
    q: "Does NestEgg store my personal information?",
    a: "The basic setup flow only uses your browser's local storage — nothing is sent to a server. NestEgg never sees your Social Security number; you enter it directly on each institution's official site.",
  },
  {
    q: "Is this financial advice?",
    a: "No. NestEgg is a financial education tool, not a registered investment adviser. Everything here is general information to help you understand your options — not personalized advice. Talk to a financial professional for guidance specific to your situation.",
  },
  {
    q: "Do I have to open all three accounts?",
    a: "No. Each account is independent. Many families start with just the 529 and add the others later. The setup flow lets you skip any step.",
  },
  {
    q: "What if my child doesn't go to college?",
    a: "The 529 isn't just for 4-year universities — it covers trade schools, vocational programs, community college, and IT certifications. And if your child doesn't pursue education at all, the money doesn't disappear. It stays invested and keeps growing; you'd just owe income tax on the gains if withdrawn for non-education purposes.",
  },
  {
    q: "Why does the projection assume 7% annual return?",
    a: "7% is a commonly used long-term average return assumption for diversified equity index funds, roughly approximating the historical real return of the U.S. stock market. It's a hypothetical illustration — not a guarantee. Investment values fluctuate, and past performance doesn't predict future results.",
  },
  {
    q: "Why Fidelity for the UTMA?",
    a: "Fidelity's custodial account has no account minimums, no fees to open, and a straightforward online application. You're not locked in — you can open a UTMA at any brokerage you prefer.",
  },
  {
    q: "Why Utah my529 for states without a deduction?",
    a: "Utah my529 is consistently rated as one of the lowest-fee 529 plans in the country and is open to residents of any state. If your home state offers a meaningful tax deduction for contributions, we'll show you that plan instead.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-12">

          {/* Mission */}
          <section className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Why NestEgg exists</h1>
            <p className="text-gray-600 mb-4">
              Most new parents know they <em>should</em> be setting their child up financially — but when they sit down to actually do it, they run into a wall. Which account first? Which plan? What if my kid doesn&apos;t go to college? Where do I even enter my information?
            </p>
            <p className="text-gray-600 mb-4">
              NestEgg was built to remove that wall. In under 10 minutes, we walk you through the three most impactful things you can do for a newborn&apos;s financial future: open a 529 education savings plan, a UTMA custodial investment account, and add your child as an authorized user on your credit card to start building their credit history from day one.
            </p>
            <p className="text-gray-600">
              We don&apos;t manage money, sell products, or take commissions. We just explain what each account is, why it matters, and link you directly to the places where you can open them.
            </p>
          </section>

          {/* How it works */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">How it works</h2>
            <ol className="space-y-4">
              {[
                { step: "1", title: "See your projection", body: "Enter a monthly contribution amount and your child's birth year. We'll show you what that money could grow into by their 18th birthday at a 7% average annual return." },
                { step: "2", title: "Follow the guided setup", body: "Three steps, one account each. We tell you what you'll need, what to expect on the site, and answer common questions along the way." },
                { step: "3", title: "Mark it done", body: "Check off each step as you finish. Come back anytime — your progress is saved in your browser." },
              ].map((item) => (
                <li key={item.step} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <p className="font-semibold text-gray-800 mb-1">{faq.q}</p>
                  <p className="text-sm text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center">
            <Link
              href="/setup"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Get started →
            </Link>
          </div>

        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
