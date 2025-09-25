"use client";

import { redirect } from "next/navigation";
import { getGoogleAuthUrl } from "@/actions/getGoogleAuthUrl";
import { clearAuth } from "@/actions/clearAuth";
import { createContext, useContext } from "react";

export async function loginWithGoogle() {
  const googleAuthUrl = await getGoogleAuthUrl();
  redirect(googleAuthUrl);
}

export function logout() {
  clearAuth();
}

const EmailContext = createContext<{
  email: string | null;
}>({
  email: null,
});

export const AuthProvider = ({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string | null;
}) => {
  const isLoggedIn = !!email;

  // If the user is logged in and on the login page, redirect to register keypass
  if (
    isLoggedIn &&
    typeof window !== "undefined" &&
    window.location.pathname === "/login"
  ) {
    redirect("/register");
  }

  // If the user is not logged in and not on the login page, redirect to the login page
  if (
    !isLoggedIn &&
    typeof window !== "undefined" &&
    window.location.pathname !== "/login"
  ) {
    redirect("/login");
  }

  return (
    <EmailContext.Provider value={{ email }}>{children}</EmailContext.Provider>
  );
};

export function useEmail() {
  return useContext(EmailContext);
}
