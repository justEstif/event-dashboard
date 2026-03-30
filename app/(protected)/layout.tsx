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
      <nav
        className="w-full h-14 border-b"
        style={{
          background: "var(--nav-bg)",
          borderColor: "var(--nav-border)",
        }}
      >
        <div className="max-w-5xl mx-auto h-full flex items-center justify-between px-5">
          {/* Brand mark — red stripe + name */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group"
          >
            <span
              className="h-5 w-[3px] rounded-full transition-transform group-hover:scale-y-110"
              style={{ background: "var(--primary)" }}
              aria-hidden
            />
            <span
              className="text-white font-bold tracking-widest uppercase text-sm"
              style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1rem", letterSpacing: "0.12em" }}
            >
              Fastbreak
            </span>
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
