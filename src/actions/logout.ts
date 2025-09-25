"use server";

import { getSession } from "@/lib/utils/getSession";
import { redirect } from "next/navigation";

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
