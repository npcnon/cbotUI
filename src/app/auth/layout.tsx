// app/auth/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication pages for the application",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground dark:bg-slate-950 dark:text-slate-50">
      {children}
    </main>
  );
}