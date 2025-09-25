import { NextRequest, NextResponse } from "next/server";
import { getEmailFromGoogleAuthCode } from "@/actions/getEmailFromGoogleAuthCode";
import { setAuth } from "@/actions/setAuth";
import { getOrCreateUser } from "@/lib/services/UserService";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const authCode = searchParams.get("code");

  if (!authCode) {
    return NextResponse.redirect(`${APP_URL}/login?error=no-token`);
  }

  try {
    const email = await getEmailFromGoogleAuthCode(authCode);
    if (!email) {
      return NextResponse.redirect(`${APP_URL}/login?error=invalid-token`);
    }

    const user = await getOrCreateUser({ email });

    await setAuth({ email, userId: user.id });

    return NextResponse.redirect(`${APP_URL}/register`);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.redirect(`${APP_URL}/login?error=invalid-token`);
  }
}
