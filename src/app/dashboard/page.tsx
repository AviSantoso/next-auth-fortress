import { getSession } from "@/lib/utils/getSession";
import { redirect } from "next/navigation";
import { DashboardPage } from "@/components/pages/DashboardPage";

export default async function Page() {
  const session = await getSession();
  const email = session.email;

  if (!email) {
    redirect("/login");
  }

  return <DashboardPage email={email} />;
}
