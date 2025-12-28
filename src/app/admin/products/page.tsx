"use client";

import { Button, Card } from "@jamsr-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import {
  getProducts,
  deleteProduct,
} from "@/services/productService";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category_id?: {
    _id: string;
    name: string;
  };
};


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* FETCH PRODUCTS */
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  /* DELETE PRODUCT */
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteProduct(deleteId);
      setProducts((prev) =>
        prev.filter((p) => p._id !== deleteId)
      );
    } catch (err) {
      alert("Failed to delete product");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return <p className="text-neutral-400">Loading products...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

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
                  key={product._id}
                  className="border-b border-neutral-800 hover:bg-neutral-800"
                >
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">
                    {product.category_id?.name ?? "—"}
                  </td>

                  <td className="p-3">${product.price}</td>
                  <td className="p-3">{product.stock}</td>

                  <td className="p-3 text-right space-x-2">
                    <Link
                      href={`/admin/products/edit/${product._id}`}
                    >
                      <Button size="sm" variant="outlined" className="
    bg-white
    text-black
    hover:bg-neutral-200
    border
    border-white
  ">
                        Edit
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      color="danger"
                      variant="outlined"
                      onClick={() => setDeleteId(product._id)}
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

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
