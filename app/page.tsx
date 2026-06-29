"use client";

import { useState } from "react";
import { Input } from "./components/ui/Input";
import { Button } from "./components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/Card";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // TODO: Amplify Data - create WarrantyRegistration (public/unauthenticated)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Registration Successful</h1>
        <p className="text-muted-foreground mb-6">
          Your battery warranty has been registered. A confirmation will be sent to your email.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Register Another Battery
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex flex-col items-center gap-3 mb-8 text-center">

        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Product Registration
        </h1>
        <p className="text-muted-foreground max-w-md">
          Register your Castrol battery warranty in under 2 minutes.
        </p>
      </div>

      <Card>
        {/* <CardHeader>
          <CardTitle>Warranty Details</CardTitle>
        </CardHeader> */}
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input id="serialNumber" label="Battery Serial Number" placeholder="e.g. CST-2024-XXXXX" required />
            <Input id="purchaseDate" label="Purchase Date" type="date" required />
            <Input id="purchaseFrom" label="Purchase From" placeholder="e.g. AutoParts Sdn Bhd" required />

            {/* <hr className="border-border my-2" /> */}

            <Input id="customerName" label="Full Name" placeholder="John Doe" required autoComplete="name" />
            <Input id="customerEmail" label="Email" type="email" placeholder="you@example.com" required autoComplete="email" />
            <Input id="customerPhone" label="Phone Number" type="tel" placeholder="+6512345678" autoComplete="tel" />

            <div className="pt-4">
              <Button type="submit" loading={loading} className="w-full">
                Register Warranty
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
