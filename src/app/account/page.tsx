import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AccountClient from "./AccountClient";

type ChildRow = {
  id: number;
  name: string;
  birth_year: number;
  monthly_contribution: number;
};

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("nestegg_session")?.value;
  if (!token) redirect("/auth");

  const session = getSession(token);
  if (!session) redirect("/auth");

  const child = db.prepare(`SELECT id, name, birth_year, monthly_contribution FROM children WHERE user_id = ? LIMIT 1`).get(session.userId) as ChildRow | undefined;
  if (!child) redirect("/setup");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 py-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{child.name}&apos;s account</h1>
          <AccountClient child={child} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
