"use client";

import { useEffect, useState } from "react";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { formatDate } from "../../lib/format";
import { PageSkeleton } from "../../components/ui/Skeleton";

type Registration = Schema["WarrantyRegistration"]["type"];

function getWarrantyStatus(expiryDate: string | null | undefined): "Active" | "Expired" {
  if (!expiryDate) return "Expired";
  return new Date(expiryDate) >= new Date() ? "Active" : "Expired";
}

export default function DealerRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [dealerName, setDealerName] = useState("");

  useEffect(() => {
    async function fetchRegistrations() {
      try {
        const session = await fetchAuthSession();
        const groups = (session.tokens?.accessToken?.payload["cognito:groups"] as string[]) || [];
        const client = generateClient<Schema>();

        if (groups.includes("ADMIN") || groups.includes("MANAGEMENT")) {
          // Admins/management see all — they should use /portal/admin instead
          const { data } = await client.models.WarrantyRegistration.list();
          setRegistrations(data || []);
        } else {
          // Dealer: match by email to find their dealer record
          const attrs = await fetchUserAttributes();
          const email = attrs.email || "";

          const { data: dealerList } = await client.models.Dealer.list({
            filter: { email: { eq: email } },
          });
          const dealer = dealerList?.[0];

          if (dealer) {
            setDealerName(dealer.name);
            const { data } = await client.models.WarrantyRegistration.list({
              filter: { dealerId: { eq: dealer.id } },
            });
            setRegistrations(data || []);
          }
        }
      } catch {
        // Failed to load
      } finally {
        setLoading(false);
      }
    }
    fetchRegistrations();
  }, []);

  if (loading) return <PageSkeleton />;

  return (
    <div className="p-6 md:p-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground uppercase">Registrations</h1>
        {dealerName && (
          <p className="text-xl font-bold text-muted-foreground mt-1">{dealerName}</p>
        )}
      </div>

      {registrations.length === 0 ? (
        <p className="text-muted-foreground">No warranty registrations found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-3 font-medium">Serial No.</th>
                <th className="py-3 font-medium">Customer</th>
                <th className="py-3 font-medium hidden sm:table-cell">Phone</th>
                <th className="py-3 font-medium hidden md:table-cell">Purchase Date</th>
                <th className="py-3 font-medium hidden md:table-cell">Expiry</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => {
                const status = getWarrantyStatus(reg.expiryDate);
                return (
                  <tr key={reg.id} className="border-b border-border">
                    <td className="py-3 text-foreground font-mono text-xs">{reg.serialNumber}</td>
                    <td className="py-3 text-foreground">{reg.customerName}</td>
                    <td className="py-3 text-foreground hidden sm:table-cell">{reg.customerPhone}</td>
                    <td className="py-3 text-foreground hidden md:table-cell">{reg.purchaseDate ? formatDate(reg.purchaseDate) : "—"}</td>
                    <td className="py-3 text-foreground hidden md:table-cell">{reg.expiryDate ? formatDate(reg.expiryDate) : "—"}</td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
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
    </div>
  );
}
