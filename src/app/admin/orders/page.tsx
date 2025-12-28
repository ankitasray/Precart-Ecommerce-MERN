"use client";

import { Button, Card } from "@jamsr-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getOrders,
  updateOrderStatus,
  Order,
} from "@/services/orderService";

/* ================= CSV EXPORT ================= */
function exportOrdersToCSV(orders: Order[]) {
  const headers = ["Order Number", "Customer", "Date", "Total", "Status"];

  const rows = orders.map((order) => [
    order.order_number,
    order.customer?.name ?? "",
    new Date(order.createdAt).toLocaleDateString(),
    order.total_amount,
    order.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "orders.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ================= STATUS COLORS ================= */
const statusColor = (status: Order["status"]) => {
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    orderId: string,
    status: Order["status"]
  ) => {
    try {
      await updateOrderStatus(orderId, status);
      loadOrders(); // refresh list
    } catch {
      alert("Failed to update order status");
    }
  };

  if (loading) {
    return <p className="text-neutral-400">Loading orders...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="text-neutral-400 mt-1">
            Manage customer orders
          </p>
        </div>

        <Button
          variant="outlined"
          onClick={() => exportOrdersToCSV(orders)}
          className="bg-white text-black hover:bg-neutral-200 border border-white"
        >
          Export CSV
        </Button>
      </div>

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-800 text-neutral-400">
              <tr>
                <th className="text-left p-3">Order</th>
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
                  key={order._id}
                  className="border-b border-neutral-800 hover:bg-neutral-800"
                >
                  <td className="p-3 font-medium text-primary">
                    <Link href={`/admin/orders/${order._id}`}>
                      {order.order_number}
                    </Link>
                  </td>

                  <td className="p-3">
                    {order.customer?.name ?? "—"}
                  </td>

                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    ${order.total_amount}
                  </td>

                  <td className={`p-3 ${statusColor(order.status)}`}>
                    {order.status}
                  </td>

                  <td className="p-3 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outlined"
                      className="bg-white text-black hover:bg-neutral-200 border border-white"
                      onClick={() =>
                        handleStatusUpdate(order._id, "Processing")
                      }
                    >
                      Process
                    </Button>

                    <Button
                      size="sm"
                      color="primary"
                      onClick={() =>
                        handleStatusUpdate(order._id, "Completed")
                      }
                    >
                      Complete
                    </Button>

                    <Button
                      size="sm"
                      color="danger"
                      variant="outlined"
                      onClick={() =>
                        handleStatusUpdate(order._id, "Cancelled")
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
