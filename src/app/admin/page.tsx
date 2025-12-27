import { Card } from "@jamsr-ui/react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-neutral-400 mt-1">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Products" value="128" />
        <StatCard title="Total Orders" value="342" />
        <StatCard title="Revenue" value="$12,450" />
        <StatCard title="Users" value="1,284" />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <ul className="space-y-3 text-sm text-neutral-400">
            <li>#ORD-1023 — $120 — Completed</li>
            <li>#ORD-1022 — $89 — Pending</li>
            <li>#ORD-1021 — $240 — Completed</li>
            <li>#ORD-1020 — $45 — Cancelled</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Low Stock Products</h2>
          <ul className="space-y-3 text-sm text-neutral-400">
            <li>Men Hoodie — 4 left</li>
            <li>Women Sneakers — 6 left</li>
            <li>Kids T-Shirt — 3 left</li>
            <li>Cap — 2 left</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* Reusable Stat Card */
function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <Card className="p-5">
      <p className="text-sm text-neutral-400">{title}</p>
      <h3 className="text-2xl font-semibold mt-2">{value}</h3>
    </Card>
  );
}
