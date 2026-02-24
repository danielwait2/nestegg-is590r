import Link from "next/link";

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
      <Link href="/" className="text-lg font-semibold text-green-700">NestEgg</Link>
      {children}
    </header>
  );
}
