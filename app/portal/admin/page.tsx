"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const tabs = ["Dealers", "Users", "Products", "Warranties", "Claims"] as const;

interface Dealer {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  createdAt: string;
}

// TODO: Replace with Amplify Data query
const mockDealers: Dealer[] = [
  { id: "1", name: "AutoParts Sdn Bhd", email: "contact@autoparts.com", phone: "+60123456789", region: "Kuala Lumpur", createdAt: "2024-06-15" },
  { id: "2", name: "Battery World Pte Ltd", email: "info@batteryworld.sg", phone: "+6591234567", region: "Singapore", createdAt: "2024-06-20" },
];

function DealerOnboarding({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // TODO: Amplify Data - create dealer UserProfile + send invite
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Input id="dealerName" label="Dealer / Company Name" placeholder="e.g. AutoParts Sdn Bhd" required />
      <Input id="dealerEmail" label="Contact Email" type="email" placeholder="dealer@example.com" required />
      <Input id="dealerPhone" label="Phone Number" type="tel" placeholder="+6512345678" />
      <Input id="dealerRegion" label="Region / Area" placeholder="e.g. Kuala Lumpur" required />
      <Button type="submit" loading={loading}>
        Onboard Dealer
      </Button>
    </form>
  );
}

function DealerList() {
  // TODO: Replace with Amplify Data list query
  const dealers = mockDealers;

  if (dealers.length === 0) {
    return <p className="text-muted-foreground">No dealers onboarded yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 font-medium text-muted-foreground">Name</th>
            <th className="pb-3 font-medium text-muted-foreground">Email</th>
            <th className="pb-3 font-medium text-muted-foreground hidden sm:table-cell">Phone</th>
            <th className="pb-3 font-medium text-muted-foreground hidden md:table-cell">Region</th>
            <th className="pb-3 font-medium text-muted-foreground hidden lg:table-cell">Onboarded</th>
          </tr>
        </thead>
        <tbody>
          {dealers.map((dealer) => (
            <tr key={dealer.id} className="border-b border-border">
              <td className="py-3 text-foreground">{dealer.name}</td>
              <td className="py-3 text-foreground">{dealer.email}</td>
              <td className="py-3 text-foreground hidden sm:table-cell">{dealer.phone}</td>
              <td className="py-3 text-foreground hidden md:table-cell">{dealer.region}</td>
              <td className="py-3 text-foreground hidden lg:table-cell">{dealer.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PortalAdminPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Dealers");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Admin Panel</h1>

      <nav className="flex gap-1 border-b border-border mb-6" aria-label="Admin sections">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
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

      {activeTab === "Dealers" ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Onboard New Dealer</CardTitle>
            </CardHeader>
            <CardContent>
              <DealerOnboarding onSuccess={() => { /* TODO: refetch dealers */ }} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Onboarded Dealers</CardTitle>
            </CardHeader>
            <CardContent>
              <DealerList />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{activeTab} Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manage {activeTab.toLowerCase()} here. Connect to Amplify Data to enable full CRUD operations.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
