const DISCLOSURE = "NestEgg is a financial education tool, not a registered investment adviser. This is not personalized financial advice.";

export default function Footer() {
  return (
    <footer className="px-4 py-6 border-t border-gray-100 bg-gray-50">
      <p className="text-xs text-gray-400 text-center max-w-lg mx-auto">{DISCLOSURE}</p>
    </footer>
  );
}
