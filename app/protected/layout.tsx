import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full border-b border-border h-14">
        <div className="max-w-5xl mx-auto h-full flex items-center justify-between px-5">
          <Link href="/dashboard" className="font-semibold text-sm">
            Fastbreak
          </Link>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-5xl w-full mx-auto px-5 py-8">
        {children}
      </main>
    </div>
  );
}
