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
import {
  getProductById,
  updateProduct,
} from "@/services/productService";
import { getCategories } from "@/services/categoryService";

type Category = {
  _id: string;
  name: string;
};

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

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

  /* Load product */
  useEffect(() => {
    if (!id) return;

    getProductById(id)
      .then((product) => {
        setForm({
          name: product.name,
          price: String(product.price),
          category_id: product.category_id,
          stock: String(product.stock),
        });
      })
      .catch(() => alert("Failed to load product"));
  }, [id]);

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

      await updateProduct(id, {
        name: form.name,
        price: Number(form.price),
        category_id: form.category_id,
        stock: Number(form.stock),
      });

      router.push("/admin/products");
    } catch (err) {
      alert("Failed to update product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Edit Product
        </h1>
        <p className="text-neutral-400 mt-1">
          Update product details
        </p>
      </div>

      <Card className="p-6 space-y-5">
        <Input
          size="lg"
          label="Product Name"
          classNames={{ label: "text-neutral-300" }}
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />

        <Input
          size="lg"
          label="Price"
          type="number"
          classNames={{ label: "text-neutral-300" }}
          value={form.price}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              price: e.target.value,
            }))
          }
        />

        {/* Category */}
        <div className="space-y-1">
          <label className="text-sm font-normal text-neutral-300">
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
            <option value="" disabled className="bg-black">
              Select category
            </option>

            {categories.map((cat) => (
              <option
                key={cat._id}
                value={cat._id}
                className="bg-black text-neutral-100"
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>


        <Input
          size="lg"
          label="Stock Quantity"
          type="number"
          classNames={{ label: "text-neutral-300" }}
          value={form.stock}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              stock: e.target.value,
            }))
          }
        />

        <div className="flex gap-4 pt-4">
          <Button
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Product"}
          </Button>

          <Button
            className="bg-white text-black hover:bg-neutral-200"
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
