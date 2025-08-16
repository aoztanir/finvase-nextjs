import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/shadcn/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finvase - Investment Banking Platform",
  description:
    "Modern investment banking platform for deals, clients, and investors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Providers>
              {children}
              <Toaster />
            </Providers>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
