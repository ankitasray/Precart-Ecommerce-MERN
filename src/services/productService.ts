const API_BASE_URL = "http://localhost:5000/api"; // change if needed

export type ProductPayload = {
  name: string;
  price: number;
  category_id: string;
  stock: number;
};


/* ===================== PRODUCTS ===================== */

// GET all products
export async function getProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// GET single product
export async function getProductById(id: string) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

// CREATE product
export async function createProduct(payload: ProductPayload) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

// UPDATE product
export async function updateProduct(id: string, payload: ProductPayload) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

// DELETE product
export async function deleteProduct(id: string) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}
