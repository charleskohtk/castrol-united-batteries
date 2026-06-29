"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function PortalLoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // TODO: Amplify Auth signIn → redirect to /portal/dashboard
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">Portal Sign In</h1>
          <p className="text-sm text-muted-foreground">Admin &amp; Dealer access only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="email" label="Email" type="email" placeholder="you@example.com" required autoComplete="email" />
          <Input id="password" label="Password" type="password" placeholder="••••••••" required autoComplete="current-password" />
          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
