import Link from "next/link";

const DISCLOSURE = "NestEgg is a financial education tool, not a registered investment adviser. This is not personalized financial advice.";

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 px-4 py-8 mt-auto">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <Link href="/" className="font-semibold text-green-700">NestEgg</Link>
          <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
          <Link href="/setup" className="hover:text-gray-900 transition-colors">Get started</Link>
        </div>
        <p className="text-xs text-gray-400 text-center sm:text-right max-w-sm">
          {DISCLOSURE}
        </p>
      </div>
    </footer>
  );
}
