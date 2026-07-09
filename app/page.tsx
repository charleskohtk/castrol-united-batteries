"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Input } from "./components/ui/Input";
import { Button } from "./components/ui/Button";
import { Card, CardContent } from "./components/ui/Card";
import { PhoneInput } from "./components/ui/PhoneInput";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

type Dealer = Schema["Dealer"]["type"];

export default function HomePage() {
  const client = generateClient<Schema>();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [dealerQuery, setDealerQuery] = useState("");
  const [purchaseDate, setPurchaseDate] = useState<Date | null>(null);

  const filteredDealers = useMemo(() => {
    if (!dealerQuery) return dealers;
    const q = dealerQuery.toLowerCase();
    return dealers.filter(
      (d) => d.name.toLowerCase().includes(q) || d.region.toLowerCase().includes(q)
    );
  }, [dealers, dealerQuery]);

  useEffect(() => {
    async function fetchDealers() {
      try {
        const { data } = await client.models.Dealer.list({
          filter: { status: { eq: "ACTIVE" } },
          authMode: "apiKey",
        });
        setDealers(data || []);
      } catch {
        // Dealers will show empty, user can still type manually
      }
    }
    fetchDealers();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    if (!purchaseDate) {
      setError("Please select a purchase date.");
      setLoading(false);
      return;
    }
    const purchaseDateStr = format(purchaseDate, "yyyy-MM-dd");
    const dealerId = selectedDealer?.id || "";

    // Calculate expiry (24 months from purchase)
    const expiry = new Date(purchaseDate);
    expiry.setMonth(expiry.getMonth() + 24);
    const expiryDate = format(expiry, "yyyy-MM-dd");

    // Get dealer name for denormalized storage
    const dealer = selectedDealer;

    try {
      const { errors } = await client.models.WarrantyRegistration.create(
        {
          serialNumber: form.get("serialNumber") as string,
          purchaseDate: purchaseDateStr,
          expiryDate,
          customerName: form.get("customerName") as string,
          customerEmail: form.get("customerEmail") as string,
          customerPhone: form.get("customerPhone") as string,
          purchaseFrom: dealer?.name || dealerQuery || "",
          dealerId: dealer?.id || undefined,
          dealerName: dealer?.name || undefined,
          termsAcceptedAt: new Date().toISOString(),
          status: "ACTIVE",
          registeredBy: "PUBLIC",
        },
        { authMode: "apiKey" }
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
            <Field className="flex flex-col gap-2">
              <Label className="text-base font-bold text-foreground">Purchase Date</Label>
              <DatePicker
                selected={purchaseDate}
                onChange={(date: Date | null) => setPurchaseDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YYYY"
                maxDate={new Date()}
                className="w-full rounded-[var(--radius)] border border-input bg-background px-3 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </Field>

            <Field className="flex flex-col gap-2">
              <Label className="text-base font-bold text-foreground">Purchased From</Label>
              <Combobox value={selectedDealer} onChange={setSelectedDealer} onClose={() => setDealerQuery("")}>
                <div className="relative mb-2">
                  <ComboboxInput
                    className="w-full rounded-[var(--radius)] border border-input bg-background px-3 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Type to search dealer..."
                    displayValue={(d: Dealer | null) => d?.name || ""}
                    onChange={(e) => setDealerQuery(e.target.value)}
                  />
                  {filteredDealers.length > 0 && (
                    <ComboboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-[var(--radius)] border border-input bg-background py-1 text-base shadow-lg focus:outline-none">
                      {filteredDealers.map((dealer) => (
                        <ComboboxOption
                          key={dealer.id}
                          value={dealer}
                          className="cursor-pointer select-none py-2.5 px-3 data-[focus]:bg-secondary text-foreground"
                        >
                          {dealer.name} — {dealer.region}
                        </ComboboxOption>
                      ))}
                    </ComboboxOptions>
                  )}
                </div>
              </Combobox>
            </Field>

            <Input id="customerName" name="customerName" label="Full Name" placeholder="John Doe" required autoComplete="name" />
            <Input id="customerEmail" name="customerEmail" label="Email" type="email" placeholder="you@example.com" required autoComplete="email" />
            <PhoneInput id="customerPhone" label="Phone Number" required />

            <label className="flex items-center justify-center align-center gap-3 cursor-pointer pt-4">
              <input
                type="checkbox"
                name="terms"
                required
                className="h-6 w-6 border-border accent-primary"
              />
              <span className="text-sm text-muted-foreground">
                I have read and agree to the{" "}
                <Link href="/terms" target="_blank" className="text-primary underline hover:opacity-80">
                  Terms &amp; Conditions
                </Link>
              </span>
            </label>

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
