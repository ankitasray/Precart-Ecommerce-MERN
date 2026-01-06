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

  // images
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [subImages, setSubImages] = useState<File[]>([]);

  /* Load categories */
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => alert("Failed to load categories"));
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.price ||
      !form.category_id ||
      !form.stock ||
      !mainImage
    ) {
      alert("Please fill all fields and upload main image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("category_id", form.category_id);
      formData.append("stock", form.stock);
      formData.append("mainImage", mainImage);

      subImages.forEach((img) => {
        formData.append("subImages", img);
      });

      await createProduct(formData);
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
        <p className="text-neutral-400 mt-1">Create a new product</p>
      </div>

      <Card className="p-6 space-y-5">
        {/* Product Name */}
        <Input
          size="lg"
          label="Product Name"
          placeholder="e.g. Men Hoodie"
          classNames={{ label: "text-neutral-300" }}
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
          classNames={{ label: "text-neutral-300" }}
          value={form.price}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, price: e.target.value }))
          }
        />

        {/* Category */}
        <div className="space-y-1">
          <label className="text-sm text-neutral-300">Category</label>
          <select
            className="w-full h-12 rounded-md bg-transparent border border-default-200 px-3 text-neutral-100"
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
          classNames={{ label: "text-neutral-300" }}
          value={form.stock}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, stock: e.target.value }))
          }
        />

        {/* Main Image */}
        <div className="space-y-1">
          <label className="text-sm text-neutral-300">
            Main Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setMainImage(e.target.files?.[0] || null)
            }
          />
        </div>

        {/* Sub Images */}
        <div className="space-y-2">
          <label className="text-sm text-neutral-300">
            Sub / Gallery Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setSubImages((prev) => [...prev, ...files]);
              e.target.value = "";
            }}
          />

          {/* Preview */}
          {subImages.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-2">
              {subImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full px-2 text-xs"
                    onClick={() =>
                      setSubImages((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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
            className="bg-white text-black"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
