"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2Icon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const COUNTDOWN = 5;

export default function SignUpSuccessPage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(COUNTDOWN);

  useEffect(() => {
    if (seconds <= 0) {
      router.push("/dashboard");
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, router]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="items-center text-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">You&apos;re in!</CardTitle>
              <CardDescription>Your account is ready to go.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Redirecting to your dashboard in
            </p>
            <div className="flex items-center justify-center">
              <span
                key={seconds}
                className="text-5xl font-bold font-heading tabular-nums text-primary animate-in zoom-in-75 duration-300"
              >
                {seconds}
              </span>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Go now
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
