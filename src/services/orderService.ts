const API_BASE_URL = "http://localhost:5000/api";

export type Order = {
  _id: string;
  order_number: string;
  customer: {
    name: string;
    email: string;
  };
  total_amount: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  createdAt: string;
};

/* GET all orders */
export async function getOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE_URL}/orders`);
  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }
  return res.json();
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
) {
  const res = await fetch(
    `${API_BASE_URL}/orders/${orderId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update order status");
  }

  return res.json();
}