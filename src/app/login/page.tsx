import { LoginPage } from "@/components/pages/LoginPage";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  if (token) {
    redirect(`/api/auth/login?token=${token}`);
  }

  const failedToLoginWithToken =
    error === "invalid-token" || error === "no-token";

  return <LoginPage failedToLoginWithToken={failedToLoginWithToken} />;
}
