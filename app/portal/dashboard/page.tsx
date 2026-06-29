import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";

// TODO: Replace with Amplify Data query
const mockRegistrations = [
  { id: "1", serialNumber: "CST-2024-00123", customerName: "John Doe", customerEmail: "john@example.com", purchaseDate: "2024-06-10", expiryDate: "2026-06-10" },
  { id: "2", serialNumber: "CST-2024-00456", customerName: "Jane Smith", customerEmail: "jane@example.com", purchaseDate: "2024-06-18", expiryDate: "2026-06-18" },
  { id: "3", serialNumber: "CST-2024-00789", customerName: "Ahmad Bin Ali", customerEmail: "ahmad@example.com", purchaseDate: "2023-01-15", expiryDate: "2025-01-15" },
];

function getWarrantyStatus(expiryDate: string): "Active" | "Expired" {
  return new Date(expiryDate) >= new Date() ? "Active" : "Expired";
}

export default function PortalDashboardPage() {
  const registrations = mockRegistrations.map((r) => ({
    ...r,
    status: getWarrantyStatus(r.expiryDate),
  }));

  const activeCount = registrations.filter((r) => r.status === "Active").length;

  const stats = [
    { label: "Active Warranties", value: String(activeCount) },
    { label: "Pending Claims", value: "0" },
    { label: "Registered Batteries", value: String(registrations.length) },
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
                    <th className="pb-3 font-medium text-muted-foreground hidden md:table-cell">Purchase Date</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="border-b border-border">
                      <td className="py-3 text-foreground font-mono text-xs">{reg.serialNumber}</td>
                      <td className="py-3 text-foreground">{reg.customerName}</td>
                      <td className="py-3 text-foreground hidden sm:table-cell">{reg.customerEmail}</td>
                      <td className="py-3 text-foreground hidden md:table-cell">{reg.purchaseDate}</td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          reg.status === "Active"
                            ? "bg-primary/10 text-primary"
                            : "bg-destructive/10 text-destructive"
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
