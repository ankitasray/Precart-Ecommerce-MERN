"use client";

import {
  Button,
  Card,
  Select,
  SelectItem,
} from "@jamsr-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Completed"
  | "Cancelled";

/* Mock order (replace with API later) */
const MOCK_ORDER = {
  id: "ORD-1001",
  customer: "John Doe",
  email: "john@example.com",
  date: "2025-01-10",
  total: "$120",
  status: "Pending" as OrderStatus,
  items: [
    {
      id: "p1",
      name: "Men Hoodie",
      price: "$45",
      quantity: 2,
    },
    {
      id: "p2",
      name: "Cap",
      price: "$30",
      quantity: 1,
    },
  ],
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [status, setStatus] = useState<OrderStatus>(
    MOCK_ORDER.status
  );

  const handleUpdateStatus = () => {
    console.log("Updated status:", status);

    // TODO: API call here
    alert(`Order status updated to "${status}"`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Order {params.id}
          </h1>
          <p className="text-neutral-400 mt-1">
            View and update order details
          </p>
        </div>

        <Button variant="outlined" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      {/* Order Summary */}
      <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Info label="Customer" value={MOCK_ORDER.customer} />
        <Info label="Email" value={MOCK_ORDER.email} />
        <Info label="Order Date" value={MOCK_ORDER.date} />
        <Info label="Total" value={MOCK_ORDER.total} />

        {/* Status Update */}
        <div>
          <p className="text-sm text-neutral-400 mb-1">
            Order Status
          </p>

          <Select
            value={[status]}
            onChange={(e) => {
              const target = e.target as unknown as {
                value: string[];
              };

              setStatus(target.value[0] as OrderStatus);
            }}
          >
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </Select>

          <Button
            className="mt-3"
            color="primary"
            onClick={handleUpdateStatus}
          >
            Update Status
          </Button>
        </div>
      </Card>

      {/* Order Items */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-800 text-neutral-400">
              <tr>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Quantity</th>
                <th className="text-right p-3">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {MOCK_ORDER.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-neutral-800 hover:bg-neutral-800"
                >
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.price}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3 text-right">
                    $
                    {(
                      parseFloat(item.price.replace("$", "")) *
                      item.quantity
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* Small helper component */
function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
