import { NextRequest, NextResponse } from "next/server";
import { tryLoginWithToken } from "@/actions/tryLoginWithToken";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${APP_URL}/login?error=no-token`);
  }

  try {
    await tryLoginWithToken({ token });

    return NextResponse.redirect(`${APP_URL}/register`);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.redirect(`${APP_URL}/login?error=invalid-token`);
  }
}
