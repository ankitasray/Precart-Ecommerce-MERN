"use client";

import { Button, Card } from "@jamsr-ui/react";
import Link from "next/link";
import { useState } from "react";


function exportOrdersToCSV(orders: any[]) {
  const headers = ["Order ID", "Customer", "Date", "Total", "Status"];

  const rows = orders.map((order) => [
    order.id,
    order.customer,
    order.date,
    order.total,
    order.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "orders.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

type OrderStatus = "Pending" | "Processing" | "Completed" | "Cancelled";

type Order = {
  id: string;
  customer: string;
  total: string;
  date: string;
  status: OrderStatus;
};

const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-1001",
    customer: "John Doe",
    total: "$120",
    date: "2025-01-10",
    status: "Pending",
  },
  {
    id: "ORD-1002",
    customer: "Sarah Smith",
    total: "$89",
    date: "2025-01-11",
    status: "Processing",
  },
  {
    id: "ORD-1003",
    customer: "Alex Johnson",
    total: "$240",
    date: "2025-01-12",
    status: "Completed",
  },
  {
    id: "ORD-1004",
    customer: "Emma Brown",
    total: "$45",
    date: "2025-01-13",
    status: "Cancelled",
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  };

  const statusColor = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "text-yellow-400";
      case "Processing":
        return "text-blue-400";
      case "Completed":
        return "text-green-400";
      case "Cancelled":
        return "text-red-400";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-neutral-400 mt-1">
          Manage customer orders
        </p>
      </div>
      <Button
        variant="outlined"
        onClick={() => exportOrdersToCSV(orders)}
      >
        Export CSV
      </Button>
      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-800 text-neutral-400">
              <tr>
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center p-6 text-neutral-500"
                  >
                    No orders found
                  </td>
                </tr>
              )}

              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-neutral-800 hover:bg-neutral-800"
                >
                  <td className="p-3 font-medium text-primary">
                     <Link href={`/admin/orders/${order.id}`}>
                      {order.id}
                    </Link>
                  </td>
                  <td className="p-3">{order.customer}</td>
                  <td className="p-3">{order.date}</td>
                  <td className="p-3">{order.total}</td>
                  <td className={`p-3 ${statusColor(order.status)}`}>
                    {order.status}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outlined"
                      onClick={() =>
                        updateStatus(order.id, "Processing")
                      }
                    >
                      Process
                    </Button>

                    <Button
                      size="sm"
                      color="primary"
                      onClick={() =>
                        updateStatus(order.id, "Completed")
                      }
                    >
                      Complete
                    </Button>

                    <Button
                      size="sm"
                      color="danger"
                      variant="outlined"
                      onClick={() =>
                        updateStatus(order.id, "Cancelled")
                      }
                    >
                      Cancel
                    </Button>
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
