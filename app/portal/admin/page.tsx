"use client";

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { PhoneInput } from "../../components/ui/PhoneInput";
import { formatDate } from "../../lib/format";
import { Trash2 } from "lucide-react";

type Dealer = Schema["Dealer"]["type"];
type Registration = Schema["WarrantyRegistration"]["type"];

const tabs = ["Dealers", "Warranties", "Users", "Products", "Claims"] as const;

function getWarrantyStatus(expiryDate: string | null | undefined): "Active" | "Expired" {
  if (!expiryDate) return "Expired";
  return new Date(expiryDate) >= new Date() ? "Active" : "Expired";
}

export default function PortalAdminPage() {
  const client = generateClient<Schema>();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Dealers");
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [region, setRegion] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [dealerRes, regRes] = await Promise.all([
          client.models.Dealer.list(),
          client.models.WarrantyRegistration.list(),
        ]);
        setDealers(dealerRes.data || []);
        setRegistrations(regRes.data || []);
      } catch {
        // Handle silently
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleCreateDealer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const phone = form.get("dealerPhone") as string;
    const tempPassword = form.get("tempPassword") as string;

    try {
      const { data } = await client.models.Dealer.create({
        name,
        email,
        phone,
        region,
        status: "ACTIVE",
      });

      await client.mutations.createDealerUser({
        email,
        name,
        tempPassword,
      });

      if (data) setDealers((prev) => [...prev, data]);
      (e.target as HTMLFormElement).reset();
      setRegion("");
    } catch {
      // Handle error
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteDealer(id: string) {
    if (!confirm("Are you sure you want to remove this dealer?")) return;
    try {
      await client.models.Dealer.delete({ id });
      setDealers((prev) => prev.filter((d) => d.id !== id));
    } catch {
      // Handle error
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Admin Panel</h1>

      <nav className="flex gap-1 border-b border-border mb-6 overflow-x-auto" aria-label="Admin sections">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            aria-selected={activeTab === tab}
            role="tab"
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === "Dealers" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Onboard New Dealer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateDealer} className="space-y-4 max-w-md">
                <Input id="name" name="name" label="Dealer / Company Name" placeholder="e.g. AutoParts Sdn Bhd" required />
                <Input id="email" name="email" label="Contact Email" type="email" placeholder="dealer@example.com" required />
                <PhoneInput id="dealerPhone" label="Phone Number" onCountryChange={setRegion} />
                <Input id="region" name="region" label="Region / Area" placeholder="e.g. Singapore" required value={region} onChange={(e) => setRegion(e.target.value)} />
                <Input id="tempPassword" name="tempPassword" label="Temporary Password" type="password" placeholder="Min 8 chars, upper+lower+number+symbol" required />
                <Button type="submit" loading={submitting}>
                  {submitting ? "Sending" : "Onboard Dealer"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Onboarded Dealers ({dealers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : dealers.length === 0 ? (
                <p className="text-muted-foreground">No dealers onboarded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 font-medium text-muted-foreground">Name</th>
                        <th className="pb-3 font-medium text-muted-foreground">Email</th>
                        <th className="pb-3 font-medium text-muted-foreground hidden sm:table-cell">Phone</th>
                        <th className="pb-3 font-medium text-muted-foreground hidden md:table-cell">Region</th>
                        <th className="pb-3 font-medium text-muted-foreground">Registrations</th>
                        <th className="pb-3 font-medium text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {dealers.map((dealer) => {
                        const count = registrations.filter((r) => r.dealerId === dealer.id).length;
                        return (
                          <tr key={dealer.id} className="border-b border-border">
                            <td className="py-3 text-foreground">{dealer.name}</td>
                            <td className="py-3 text-foreground">{dealer.email}</td>
                            <td className="py-3 text-foreground hidden sm:table-cell">{dealer.phone || "—"}</td>
                            <td className="py-3 text-foreground hidden md:table-cell">{dealer.region}</td>
                            <td className="py-3 text-foreground font-medium">{count}</td>
                            <td className="py-3">
                              <button
                                onClick={() => handleDeleteDealer(dealer.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                                aria-label={`Delete ${dealer.name}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "Warranties" && <WarrantiesByDealer dealers={dealers} registrations={registrations} loading={loading} />}

      {activeTab !== "Dealers" && activeTab !== "Warranties" && (
        <Card>
          <CardHeader>
            <CardTitle>{activeTab} Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Manage {activeTab.toLowerCase()} here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function WarrantiesByDealer({
  dealers,
  registrations,
  loading,
}: {
  dealers: Dealer[];
  registrations: Registration[];
  loading: boolean;
}) {
  const [selectedDealerId, setSelectedDealerId] = useState<string>("ALL");

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const filtered = selectedDealerId === "ALL"
    ? registrations
    : selectedDealerId === "UNASSIGNED"
      ? registrations.filter((r) => !r.dealerId)
      : registrations.filter((r) => r.dealerId === selectedDealerId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select
          id="dealerFilter"
          label="Filter by Dealer"
          value={selectedDealerId}
          onChange={setSelectedDealerId}
          options={[
            { value: "ALL", label: `All Dealers (${registrations.length})` },
            { value: "UNASSIGNED", label: `Unassigned (${registrations.filter((r) => !r.dealerId).length})` },
            ...dealers.map((d) => ({
              value: d.id,
              label: `${d.name} (${registrations.filter((r) => r.dealerId === d.id).length})`,
            })),
          ]}
          className="w-72"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Warranty Registrations ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-muted-foreground">No registrations found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Serial Number</th>
                    <th className="pb-3 font-medium text-muted-foreground">Customer</th>
                    <th className="pb-3 font-medium text-muted-foreground hidden sm:table-cell">Dealer</th>
                    <th className="pb-3 font-medium text-muted-foreground hidden md:table-cell">Purchase Date</th>
                    <th className="pb-3 font-medium text-muted-foreground hidden md:table-cell">Expiry Date</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((reg) => {
                    const status = getWarrantyStatus(reg.expiryDate);
                    return (
                      <tr key={reg.id} className="border-b border-border">
                        <td className="py-3 text-foreground font-mono text-xs">{reg.serialNumber}</td>
                        <td className="py-3 text-foreground">{reg.customerName}</td>
                        <td className="py-3 text-foreground hidden sm:table-cell">{reg.dealerName || reg.purchaseFrom || "—"}</td>
                        <td className="py-3 text-foreground hidden md:table-cell">{reg.purchaseDate ? formatDate(reg.purchaseDate) : "—"}</td>
                        <td className="py-3 text-foreground hidden md:table-cell">{reg.expiryDate ? formatDate(reg.expiryDate) : "—"}</td>
                        <td className="py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            status === "Active"
                              ? "bg-primary/10 text-primary"
                              : "bg-destructive/10 text-destructive"
                          }`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
