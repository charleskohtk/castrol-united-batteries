"use client";

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { PageSkeleton } from "../../components/ui/Skeleton";
import { formatDate } from "../../lib/format";

type Registration = Schema["WarrantyRegistration"]["type"];

function getWarrantyStatus(expiryDate: string | null | undefined): "Active" | "Expired" {
  if (!expiryDate) return "Expired";
  return new Date(expiryDate) >= new Date() ? "Active" : "Expired";
}

export default function PortalDashboardPage() {
  const client = generateClient<Schema>();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await client.models.WarrantyRegistration.list();
        setRegistrations(data || []);
      } catch {
        // Handle error silently for now
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <PageSkeleton />;

  const activeCount = registrations.filter(
    (r) => getWarrantyStatus(r.expiryDate) === "Active"
  ).length;

  const stats = [
    { label: "Active Warranties", value: String(activeCount) },
    { label: "Total Registrations", value: String(registrations.length) },
    { label: "Expired", value: String(registrations.length - activeCount) },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardTitle>{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-foreground">{s.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {registrations.length === 0 ? (
            <p className="text-muted-foreground">No registrations yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Serial Number</th>
                    <th className="pb-3 font-medium text-muted-foreground">Customer</th>
                    <th className="pb-3 font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                    <th className="pb-3 font-medium text-muted-foreground hidden sm:table-cell">Dealer</th>
                    <th className="pb-3 font-medium text-muted-foreground hidden md:table-cell">Purchase Date</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => {
                    const status = getWarrantyStatus(reg.expiryDate);
                    return (
                      <tr key={reg.id} className="border-b border-border">
                        <td className="py-3 text-foreground font-mono text-xs">{reg.serialNumber}</td>
                        <td className="py-3 text-foreground">{reg.customerName}</td>
                        <td className="py-3 text-foreground hidden sm:table-cell">{reg.customerEmail}</td>
                        <td className="py-3 text-foreground hidden sm:table-cell">{reg.dealerName || reg.purchaseFrom || "—"}</td>
                        <td className="py-3 text-foreground hidden md:table-cell">{reg.purchaseDate ? formatDate(reg.purchaseDate) : "—"}</td>
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
