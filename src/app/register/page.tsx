import { RegisterPage } from "@/components/pages/RegisterPage";
import { getCredentialIdsByEmail } from "@/lib/services/UserCredentialService";
import { getSession } from "@/lib/utils/getSession";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();

  if (!session.email) {
    console.error("No session email");
    redirect("/login");
  }

  const passkeyIds = await getCredentialIdsByEmail({ email: session.email });

  if (passkeyIds.length > 0) {
    redirect("/");
  }

  return <RegisterPage />;
}
