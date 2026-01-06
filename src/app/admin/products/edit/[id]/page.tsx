"use client";

import { Button, Card, Input } from "@jamsr-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getProductById,
  updateProduct,
  addProductImages,
  updateMainImage,
  updateSubImage,
  deleteProductImage,
} from "@/services/productService";
import { getCategories } from "@/services/categoryService";

/* ================= TYPES ================= */

type Category = {
  _id: string;
  name: string;
};

type ProductImage = {
  _id: string;
  image_url: string;
};

/* ================= PAGE ================= */

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [updatingImageId, setUpdatingImageId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category_id: "",
    stock: "",
  });

  // images
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [newSubImages, setNewSubImages] = useState<File[]>([]);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    if (!id) return;

    getProductById(id).then((data) => {
      setForm({
        name: data.product.name,
        price: String(data.product.price),
        category_id: data.product.category_id,
        stock: String(data.product.stock),
      });
      setExistingImages(data.subImages || []);
    });
  }, [id]);

  /* ================= SUB IMAGE HANDLERS ================= */

  const handleUpdateSubImage = async (imageId: string, file: File) => {
    try {
      setUpdatingImageId(imageId);

      const fd = new FormData();
      fd.append("subImage", file);

      await updateSubImage(imageId, fd);

      const data = await getProductById(id);
      setExistingImages(data.subImages || []);
    } catch {
      alert("Failed to update sub image");
    } finally {
      setUpdatingImageId(null);
    }
  };

  const handleDeleteSubImage = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;

    try {
      await deleteProductImage(imageId);
      setExistingImages((prev) =>
        prev.filter((img) => img._id !== imageId)
      );
    } catch {
      alert("Failed to delete image");
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category_id || !form.stock) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Update text
      await updateProduct(id, {
        name: form.name,
        price: Number(form.price),
        category_id: form.category_id,
        stock: Number(form.stock),
      });

      // 2️⃣ Update main image
      if (mainImage) {
        const fd = new FormData();
        fd.append("mainImage", mainImage);
        await updateMainImage(id, fd);
      }

      // 3️⃣ Add new sub images
      if (newSubImages.length > 0) {
        const fd = new FormData();
        newSubImages.forEach((img) => fd.append("subImages", img));
        await addProductImages(id, fd);
      }

      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Product</h1>
        <p className="text-neutral-400 mt-1">
          Update product details and images
        </p>
      </div>

      <Card className="p-6 space-y-5">
        {/* Name */}
        <Input
          size="lg"
          label="Product Name"
          value={form.name}
          onChange={(e) =>
            setForm((p) => ({ ...p, name: e.target.value }))
          }
        />

        {/* Price */}
        <Input
          size="lg"
          label="Price"
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm((p) => ({ ...p, price: e.target.value }))
          }
        />

        {/* Category */}
        <div>
          <label className="text-sm text-neutral-300">Category</label>
          <select
            className="w-full h-12 border rounded px-3 bg-transparent"
            value={form.category_id}
            onChange={(e) =>
              setForm((p) => ({ ...p, category_id: e.target.value }))
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
          label="Stock"
          type="number"
          value={form.stock}
          onChange={(e) =>
            setForm((p) => ({ ...p, stock: e.target.value }))
          }
        />

        {/* Main Image */}
        <div>
          <label className="text-sm text-neutral-300">
            Replace Main Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setMainImage(e.target.files?.[0] || null)
            }
          />
        </div>

        {/* Existing Sub Images */}
        {existingImages.length > 0 && (
          <div>
            <label className="text-sm text-neutral-300">
              Existing Gallery Images
            </label>

            <div className="grid grid-cols-4 gap-3 mt-2">
              {existingImages.map((img) => (
                <div key={img._id} className="relative group">
                  <img
                    src={img.image_url}
                    className={`w-full h-24 object-cover rounded ${
                      updatingImageId === img._id ? "opacity-50" : ""
                    }`}
                  />

                  {updatingImageId === img._id && (
                    <div className="absolute inset-0 bg-black/50 text-white text-xs flex items-center justify-center">
                      Updating...
                    </div>
                  )}

                  {/* Replace */}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file)
                        handleUpdateSubImage(img._id, file);
                      e.currentTarget.value = "";
                    }}
                  />

                  {/* Delete */}
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 text-xs opacity-0 group-hover:opacity-100"
                    onClick={() => handleDeleteSubImage(img._id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Sub Images */}
        <div>
          <label className="text-sm text-neutral-300">
            Add New Gallery Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setNewSubImages((p) => [...p, ...files]);
              e.currentTarget.value = "";
            }}
          />

          {/* Preview */}
          {newSubImages.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-3">
              {newSubImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full px-2"
                    onClick={() =>
                      setNewSubImages((prev) =>
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
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Update Product"}
          </Button>

          <Button variant="outlined" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
