const API_BASE_URL = "http://localhost:5000/api"; // change if needed

/* ===================== TYPES ===================== */

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

/* ===================== CREATE PRODUCT (WITH IMAGES) ===================== */
export async function createProduct(formData: FormData) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    body: formData, // ❗ DO NOT set Content-Type
  });

  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

/* ===================== UPDATE PRODUCT (NO IMAGES) ===================== */
export async function updateProduct(
  id: string,
  payload: ProductPayload
) {
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
/* ===================== UPDATE MAIN IMAGE ===================== */
export async function updateMainImage(
  productId: string,
  formData: FormData
) {
  const res = await fetch(
    `${API_BASE_URL}/products/${productId}/main-image`,
    {
      method: "PUT",
      body: formData, // FormData
    }
  );

  if (!res.ok) throw new Error("Failed to update main image");
  return res.json();
}

/* ===================== UPDATE SINGLE SUB IMAGE ===================== */
export async function updateSubImage(
  imageId: string,
  formData: FormData
) {
  const res = await fetch(
    `${API_BASE_URL}/products/images/${imageId}`,
    {
      method: "PUT",
      body: formData, // FormData
    }
  );

  if (!res.ok) throw new Error("Failed to update sub image");
  return res.json();
}

/* ===================== DELETE SUB IMAGE ===================== */
export async function deleteProductImage(imageId: string) {
  const res = await fetch(
    `${API_BASE_URL}/products/images/${imageId}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) throw new Error("Failed to delete sub image");
  return res.json();
}
/* ===================== ADD SUB / GALLERY IMAGES ===================== */
export async function addProductImages(
  productId: string,
  formData: FormData
) {
  const res = await fetch(
    `${API_BASE_URL}/products/${productId}/images`,
    {
      method: "POST",
      body: formData, // FormData (images)
    }
  );

  if (!res.ok) throw new Error("Failed to add product images");
  return res.json();
}
