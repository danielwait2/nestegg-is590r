import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-green-700 tracking-tight">
          NestEgg
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/about" className="text-gray-500 hover:text-gray-900 transition-colors">
            About
          </Link>
          <Link
            href="/setup"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
