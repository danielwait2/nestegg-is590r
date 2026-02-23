import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import Link from "next/link";

type EventRow = { event: string; count: number };
type PlanRow = { step_529_plan_name: string; count: number };
type IssuerRow = { step_credit_issuer: string; count: number };
type TotalRow = { total: number };

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("nestegg_session")?.value;
  if (!token) redirect("/auth");

  const session = getSession(token);
  if (!session) redirect("/auth");

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && session.email !== adminEmail) redirect("/");

  const total = (db.prepare(`SELECT COUNT(*) as total FROM users`).get() as TotalRow).total;

  const eventCounts = db.prepare(`
    SELECT event, COUNT(*) as count FROM events GROUP BY event ORDER BY count DESC
  `).all() as EventRow[];

  const planCounts = db.prepare(`
    SELECT step_529_plan_name, COUNT(*) as count FROM setup_progress
    WHERE step_529_plan_name IS NOT NULL
    GROUP BY step_529_plan_name ORDER BY count DESC LIMIT 10
  `).all() as PlanRow[];

  const issuerCounts = db.prepare(`
    SELECT step_credit_issuer, COUNT(*) as count FROM setup_progress
    WHERE step_credit_issuer IS NOT NULL
    GROUP BY step_credit_issuer ORDER BY count DESC
  `).all() as IssuerRow[];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">NestEgg Admin</h1>
          <Link href="/" className="text-sm text-green-600 hover:underline">← Back to site</Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-gray-500 text-sm">Total users</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">{total}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Event funnel</h2>
          {eventCounts.length === 0 ? (
            <p className="text-sm text-gray-400">No events yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-400 border-b border-gray-100"><th className="pb-2">Event</th><th className="pb-2 text-right">Count</th></tr></thead>
              <tbody>
                {eventCounts.map((row) => (
                  <tr key={row.event} className="border-b border-gray-50">
                    <td className="py-2 text-gray-700 font-mono text-xs">{row.event}</td>
                    <td className="py-2 text-right font-semibold text-gray-900">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top 529 plans</h2>
            {planCounts.length === 0 ? <p className="text-sm text-gray-400">No data yet.</p> : (
              <div className="space-y-2">
                {planCounts.map((row) => (
                  <div key={row.step_529_plan_name} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">{row.step_529_plan_name}</span>
                    <span className="font-semibold">{row.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Card issuers</h2>
            {issuerCounts.length === 0 ? <p className="text-sm text-gray-400">No data yet.</p> : (
              <div className="space-y-2">
                {issuerCounts.map((row) => (
                  <div key={row.step_credit_issuer} className="flex justify-between text-sm">
                    <span className="text-gray-600">{row.step_credit_issuer}</span>
                    <span className="font-semibold">{row.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
