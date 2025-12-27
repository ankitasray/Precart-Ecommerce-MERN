"use client";

import {
  Button,
  Card,
  Input,
  Select,
  SelectItem,
} from "@jamsr-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* TEMP mock data (replace with API later) */
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Men Hoodie",
    price: "45",
    category: ["Men"],
    stock: "12",
  },
  {
    id: "2",
    name: "Women Sneakers",
    price: "89",
    category: ["Women"],
    stock: "6",
  },
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: [] as string[],
    stock: "",
  });

  /* Prefill product */
  useEffect(() => {
    const product = MOCK_PRODUCTS.find(
      (p) => p.id === productId
    );

    if (product) {
      setForm({
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock,
      });
    }
  }, [productId]);

  const handleSubmit = () => {
    const payload = {
      ...form,
      id: productId,
      category: form.category[0],
    };

    console.log("Updated Product:", payload);
    router.push("/admin/products");
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Edit Product</h1>
        <p className="text-neutral-400 mt-1">
          Update product details
        </p>
      </div>

      <Card className="p-6 space-y-5">
        {/* Product Name */}
        <Input
          size="lg"
          label="Product Name"
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
          value={form.price}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              price: e.target.value,
            }))
          }
        />

        {/* Category (Jamsr UI – FIXED) */}
        <Select
          size="lg"
          label="Category"
          value={form.category}
          onChange={(e) => {
            const target = e.target as unknown as {
              value: string[];
            };

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

        {/* Stock */}
        <Input
          size="lg"
          label="Stock Quantity"
          type="number"
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
          <Button color="primary" onClick={handleSubmit}>
            Update Product
          </Button>

          <Button
            variant="outlined" color="warning"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
