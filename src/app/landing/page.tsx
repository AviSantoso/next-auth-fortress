import { getSession } from "@/lib/utils/getSession";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/pages/LandingPage";

export default async function Page() {
  const session = await getSession();
  const email = session.email;

  if (!email) {
    redirect("/login");
  }

  return <LandingPage />;
}
