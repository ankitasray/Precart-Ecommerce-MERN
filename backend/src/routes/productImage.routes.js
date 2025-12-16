import express from "express";
import { addProductImage, getImagesByProduct } from "../controllers/productImage.controller.js";

const router = express.Router();

router.post("/", addProductImage);
router.get("/:productId", getImagesByProduct);

export default router;
