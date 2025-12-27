"use client";

import { Button, Card } from "@jamsr-ui/react";
import Link from "next/link";
import { useState } from "react";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

const INITIAL_PRODUCTS = [
  {
    id: "1",
    name: "Men Hoodie",
    category: "Men",
    price: "$45",
    stock: 12,
  },
  {
    id: "2",
    name: "Women Sneakers",
    category: "Women",
    price: "$89",
    stock: 6,
  },
];

export default function ProductsPage() {
  // ✅ PRODUCTS STATE
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // ✅ DELETE STATE
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (!deleteId) return;

    setProducts((prev) =>
      prev.filter((product) => product.id !== deleteId)
    );

    setDeleteId(null); // close modal
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-neutral-400 mt-1">
            Manage your store products
          </p>
        </div>

        <Link href="/admin/products/add">
          <Button color="primary">Add Product</Button>
        </Link>
      </div>

      {/* Products Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-800 text-neutral-400">
              <tr>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center p-6 text-neutral-500"
                  >
                    No products found
                  </td>
                </tr>
              )}

              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-neutral-800 hover:bg-neutral-800"
                >
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">{product.price}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3 text-right space-x-2">
                    <Link href={`/admin/products/edit/${product.id}`}>
                      <Button size="sm" variant="outlined">
                        Edit
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      color="danger"
                      variant="outlined"
                      onClick={() => setDeleteId(product.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
