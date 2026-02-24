import Link from "next/link";

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-green-700">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 2C9 2 6.5 4 6 7C4 7.5 2 9.5 2 12c0 2.5 2 4.5 4.5 5h11c2.5-.5 4.5-2.5 4.5-5 0-2.5-2-4.5-4-5-.5-3-3-5-6-5z" fill="#bbf7d0" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 10v7M12 10c-1.5-1.5-3.5-2-5-1.5M12 10c1.5-1.5 3.5-2 5-1.5" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        NestEgg
      </Link>
      {children}
    </header>
  );
}
