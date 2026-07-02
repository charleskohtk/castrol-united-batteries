"use client";

import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Input } from "./components/ui/Input";
import { Button } from "./components/ui/Button";
import { Card, CardContent } from "./components/ui/Card";
import { PhoneInput } from "./components/ui/PhoneInput";

const client = generateClient<Schema>();

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const purchaseDate = form.get("purchaseDate") as string;

    // Calculate expiry (24 months from purchase)
    const expiry = new Date(purchaseDate);
    expiry.setMonth(expiry.getMonth() + 24);
    const expiryDate = expiry.toISOString().split("T")[0];

    try {
      const { errors } = await client.models.WarrantyRegistration.create(
        {
          serialNumber: form.get("serialNumber") as string,
          purchaseDate,
          expiryDate,
          customerName: form.get("customerName") as string,
          customerEmail: form.get("customerEmail") as string,
          customerPhone: form.get("customerPhone") as string,
          purchaseFrom: form.get("purchaseFrom") as string,
          status: "ACTIVE",
          registeredBy: "PUBLIC",
        },
        { authMode: "identityPool" }
      );

      if (errors) {
        setError("Registration failed. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl font-bold text-foreground md:text-3xl uppercase">
          Product Registration
        </h1>
        <p className="text-muted-foreground max-w-md">
          Register your Castrol battery warranty in under 2 minutes.
        </p>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input id="serialNumber" name="serialNumber" label="Battery Serial Number" placeholder="e.g. CST-2024-XXXXX" required />
            <Input id="purchaseDate" name="purchaseDate" label="Purchase Date" type="date" required />
            <Input id="purchaseFrom" name="purchaseFrom" label="Purchase From" placeholder="e.g. AutoParts Sdn Bhd" required />

            <Input id="customerName" name="customerName" label="Full Name" placeholder="John Doe" required autoComplete="name" />
            <Input id="customerEmail" name="customerEmail" label="Email" type="email" placeholder="you@example.com" required autoComplete="email" />
            <PhoneInput id="customerPhone" label="Phone Number" required />

            {error && (
              <p className="text-sm text-destructive" role="alert">{error}</p>
            )}

            <div className="pt-4">
              <Button type="submit" loading={loading} className="w-full">
                Register Now
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
