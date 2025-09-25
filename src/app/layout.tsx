import "./globals.css";

import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { getAuth } from "@/actions/getAuth";
import { MainLayout } from "@/components/layout/MainLayout";

export const metadata: Metadata = {
  title: "Next-Auth Fortress",
  description: "A secure, passwordless authentication template for Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await getAuth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased bg-black`}>
        <Provider>
          <Toaster />
          <AuthProvider email={auth.email}>
            <MainLayout>{children}</MainLayout>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
