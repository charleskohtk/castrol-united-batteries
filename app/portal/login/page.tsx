"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "aws-amplify/auth";
import Image from "next/image";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function PortalLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password,
      });

      if (isSignedIn) {
        router.push("/portal/dashboard");
      } else if (nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        setError("Please verify your email before signing in.");
      } else if (nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        setError("You need to set a new password. Contact your administrator.");
      } else {
        setError("Additional verification required.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Image src="/castrol-logo.svg" alt="Castrol" width={48} height={48} />
          <h1 className="text-2xl font-bold text-foreground">Portal Sign In</h1>
          <p className="text-sm text-muted-foreground">Admin &amp; Dealer access only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="email" name="email" label="Email" type="email" placeholder="you@example.com" required autoComplete="email" />
          <Input id="password" name="password" label="Password" type="password" placeholder="••••••••" required autoComplete="current-password" />

          {error && (
            <p className="text-sm text-destructive" role="alert">{error}</p>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
