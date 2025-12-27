"use client";

import { Button, Card, Input } from "@jamsr-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createProduct } from "@/services/productService";
import { getCategories } from "@/services/categoryService";

type Category = {
  _id: string;
  name: string;
};

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category_id: "",
    stock: "",
  });

  /* Load categories */
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => alert("Failed to load categories"));
  }, []);

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.price ||
      !form.category_id ||
      !form.stock
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await createProduct({
        name: form.name,
        price: Number(form.price),
        category_id: form.category_id,
        stock: Number(form.stock),
      });

      router.push("/admin/products");
    } catch {
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Add Product</h1>
        <p className="text-neutral-400 mt-1">
          Create a new product
        </p>
      </div>

      <Card className="p-6 space-y-5">
        {/* Product Name */}
        <Input
          size="lg"
          label="Product Name"
          placeholder="e.g. Men Hoodie"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
        />

        {/* Price */}
        <Input
          size="lg"
          label="Price"
          type="number"
          placeholder="e.g. 49.99"
          value={form.price}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, price: e.target.value }))
          }
        />

        {/* Category (native select, styled to match Jamsr Input) */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-300">
            Category
          </label>

          <select
            className="
              w-full
              h-12
              rounded-md
              bg-transparent
              border
              border-default-200
              px-3
              text-base
              text-neutral-100
              outline-none
              focus:border-primary
              focus:ring-1
              focus:ring-primary
            "
            value={form.category_id}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                category_id: e.target.value,
              }))
            }
          >
            <option value="" disabled>
              Select category
            </option>

            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stock */}
        <Input
          size="lg"
          label="Stock Quantity"
          type="number"
          placeholder="e.g. 20"
          value={form.stock}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, stock: e.target.value }))
          }
        />

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Product"}
          </Button>

          <Button
            variant="outlined"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
