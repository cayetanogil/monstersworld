import type { Metadata } from "next";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import { ConvexClientProvider } from "../app/providers/ConvexClientProvider";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "MonstersWorld",
  description: "Find monsters around the world!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="mx-auto flex max-w-screen-2xl flex-col bg-slate-700 text-slate-100">
          <header className="flex h-16 flex-row items-center justify-between px-8">
            <div className="font-mono text-3xl">MonstersWorld</div>
            <nav className="flex flex-row gap-6">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </nav>
          </header>
          <main className="flex w-full flex-row justify-between gap-8 py-20">
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </main>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
