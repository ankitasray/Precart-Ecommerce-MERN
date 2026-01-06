import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductImage,
  deleteProductImage,
  updateMainImage,
  updateSubImage,
} from "../controllers/product.controller.js";

import { uploadProductImages } from "../../middleware/upload.js";

const router = express.Router();

/* ================= PRODUCTS ================= */

// CREATE product (main image + sub images)
router.post(
  "/",
  uploadProductImages.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 5 },
  ]),
  createProduct
);

// GET all products
router.get("/", getProducts);

// GET product details
router.get("/:id", getProductById);

// UPDATE product (TEXT ONLY)
router.put("/:id", updateProduct);

// UPDATE main image
router.put(
  "/:id/main-image",
  uploadProductImages.single("mainImage"),
  updateMainImage
);

// DELETE product
router.delete("/:id", deleteProduct);

/* ================= SUB IMAGES ================= */

// ADD sub images
router.post(
  "/:id/images",
  uploadProductImages.array("subImages", 5),
  addProductImage
);

// UPDATE sub image
router.put(
  "/images/:imageId",
  uploadProductImages.single("subImage"),
  updateSubImage
);

// DELETE sub image
router.delete("/images/:imageId", deleteProductImage);

export default router;
