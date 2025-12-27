"use client";

import {
  Button,
  Card,
  Input,
  Select,
  SelectItem,
} from "@jamsr-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProduct } from "@/services/productService";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: [] as string[],
    stock: "",
  });

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.price ||
      !form.category.length ||
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
        category: form.category[0], // array → string
        stock: Number(form.stock),
      });

      router.push("/admin/products");
    } catch (err) {
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
            setForm((prev) => ({
              ...prev,
              name: e.target.value,
            }))
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
            setForm((prev) => ({
              ...prev,
              price: e.target.value,
            }))
          }
        />

        {/* Category */}
      <Select
        size="lg"
        label="Category"
        className="w-full"
        value={form.category}
        onChange={(e) => {
          const value = (e.currentTarget as unknown as {
            value: string[];
          }).value;

          setForm((prev) => ({
            ...prev,
            category: value,
          }));
        }}
      >
        <SelectItem value="Men">Men</SelectItem>
        <SelectItem value="Women">Women</SelectItem>
        <SelectItem value="Kids">Kids</SelectItem>
      </Select>



        {/* Stock */}
        <Input
          size="lg"
          label="Stock Quantity"
          type="number"
          placeholder="e.g. 20"
          value={form.stock}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              stock: e.target.value,
            }))
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
