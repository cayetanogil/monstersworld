import type { Metadata } from "next";

import { ConvexClientProvider } from "../app/providers/ConvexClientProvider";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import "./globals.css";

export const metadata: Metadata = {
  title: "Monsters World",
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
        <body className="mx-auto flex max-w-screen-2xl flex-col text-slate-800">
          <header className="flex h-12 flex-row items-center justify-between px-4">
            <div className="text-xl">MonstersWorld</div>
            <nav className="flex flex-row gap-4">
              <ul>
                <li>
                  <a href="#">About</a>
                </li>
              </ul>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </nav>
          </header>
          <main className="flex w-full flex-row justify-between gap-8 py-12">
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
