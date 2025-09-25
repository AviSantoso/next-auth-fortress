import { RegisterPage } from "@/components/pages/RegisterPage";
import { getSession } from "@/lib/utils/getSession";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();

  if (!session.email) {
    console.error("No session email");
    redirect("/login");
  }

  return <RegisterPage />;
}
