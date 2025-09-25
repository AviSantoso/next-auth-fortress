import { getSession } from "@/lib/utils/getSession";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  const email = session.email;

  if (!email) {
    redirect("/login");
  }

  redirect("/landing");
}
