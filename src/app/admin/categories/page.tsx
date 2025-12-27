"use client";

import { Button, Card, Input } from "@jamsr-ui/react";
import { useEffect, useState } from "react";
import { getCategories } from "@/services/categoryService";
import { deleteCategory } from "@/services/categoryService";

const API_BASE_URL = "http://localhost:5000/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<
    { _id: string; name: string }[]
  >([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async () => {
    if (!name) return alert("Category name required");

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setName("");
      loadCategories();
    } catch {
      alert("Failed to create category");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
  const confirm = window.confirm(
    "Are you sure? Products using this category may be affected."
  );

  if (!confirm) return;

  try {
    await deleteCategory(id);
    loadCategories(); // refresh list
  } catch {
    alert("Failed to delete category");
  }
};

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Categories</h1>

      {/* Add Category */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-medium">Add Category</h2>

        <Input
          size="lg"
          label="Category Name"
          placeholder="e.g. Men"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button
          color="primary"
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? "Saving..." : "Create Category"}
        </Button>
      </Card>

      {/* Category List */}
      <Card>
        <ul className="divide-y divide-neutral-800">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="py-3 flex justify-between items-center"
            >
              <span>{cat.name}</span>
                <Button
                size="sm"
                color="danger"
                variant="outlined"
                onClick={() => handleDelete(cat._id)}
            >
                Delete
                </Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
