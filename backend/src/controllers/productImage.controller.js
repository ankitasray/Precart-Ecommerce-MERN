import ProductImage from "../models/ProductImage.js";

// Add product image
export const addProductImage = async (req, res) => {
  try {
    const img = await ProductImage.create(req.body);
    res.status(201).json(img);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get images by product
export const getImagesByProduct = async (req, res) => {
  try {
    const images = await ProductImage.find({ product_id: req.params.productId });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
