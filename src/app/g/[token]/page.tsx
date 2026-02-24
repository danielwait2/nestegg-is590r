import { notFound } from "next/navigation";
import db from "@/lib/db";
import ProjectionCard from "@/components/ProjectionCard";
import Header from "@/components/Header";

type GiftLink = {
  token: string;
  name: string;
  birth_year: number;
  clicks: number;
};

export default async function GiftPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const row = db.prepare(`
    SELECT gl.token, c.name, c.birth_year, gl.clicks
    FROM gift_links gl
    JOIN children c ON c.id = gl.child_id
    WHERE gl.token = ?
  `).get(token) as GiftLink | undefined;

  if (!row) notFound();

  // Increment click count
  db.prepare(`UPDATE gift_links SET clicks = clicks + 1 WHERE token = ?`).run(token);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Help build {row.name}&apos;s NestEgg
          </h1>
          <p className="text-gray-500">See what a monthly contribution could grow into by {row.name}&apos;s 18th birthday.</p>
        </div>
        <ProjectionCard initialBirthYear={row.birth_year} childName={row.name} />
      </div>
      <footer className="border-t border-gray-100 py-6 px-4 mt-8">
        <p className="text-xs text-gray-400 text-center max-w-lg mx-auto">
          NestEgg is a financial education tool, not a registered investment adviser. This is not personalized financial advice.
        </p>
      </footer>
    </div>
  );
}
