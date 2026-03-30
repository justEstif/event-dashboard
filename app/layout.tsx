import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Fastbreak",
  description: "Discover and manage sporting events.",
};

const barlow = Barlow({
  variable: "--font-barlow",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  display: "swap",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${barlow.variable} ${barlowCondensed.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">{children}</div>
            <footer className="border-t border-border bg-muted/40 py-5 px-6 mt-auto">
              <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span>© {new Date().getFullYear()}</span>
                  <a
                    href="https://justestif.github.io/portfolio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Estifanos Beyene
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span>Next.js</span>
                  <span aria-hidden>·</span>
                  <span>Supabase</span>
                  <span aria-hidden>·</span>
                  <span>Tailwind CSS</span>
                  <span aria-hidden>·</span>
                  <a
                    href="/design"
                    className="hover:text-primary transition-colors"
                  >
                    Design System
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
