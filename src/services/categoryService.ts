const API_BASE_URL = "http://localhost:5000/api";

export async function getCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function deleteCategory(id: string) {
  const res = await fetch(
    `http://localhost:5000/api/categories/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete category");
  }

  return res.json();
}
