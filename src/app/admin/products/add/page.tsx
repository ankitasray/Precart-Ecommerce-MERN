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

export default function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: [] as string[],
    stock: "",
  });

  const handleSubmit = () => {
    const payload = {
      ...form,
      category: form.category[0], // array → string
    };

    console.log("New Product:", payload);
    router.push("/admin/products");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add Product</h1>
        <p className="text-neutral-400 mt-1">
          Create a new product for your store
        </p>
      </div>

      <Card className="p-6 space-y-5">
        <Input
          size="lg"
          label="Product Name"
          placeholder="e.g. Men Hoodie"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
        />

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

        <Select
          size="lg"
          label="Category"
          placeholder="Select category"
          value={form.category}
            onChange={(e) => {
                const target = e.target as unknown as { value: string[] };

                setForm((prev) => ({
                ...prev,
                category: target.value,
                }));
            }}
            >
          <SelectItem value="Men">Men</SelectItem>
          <SelectItem value="Women">Women</SelectItem>
          <SelectItem value="Kids">Kids</SelectItem>
        </Select>

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

        <div className="flex gap-4 pt-4">
          <Button color="primary" onClick={handleSubmit}>
            Save Product
          </Button>

          <Button color="warning" variant="outlined" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
