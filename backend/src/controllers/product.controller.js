import Product from "../models/Product.js";
import ProductImage from "../models/ProductImage.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

export const createProduct = async (req, res) => {
  try {
    // 🔴 IMPORTANT: files come from multer, NOT req.body
    if (!req.files || !req.files.mainImage) {
      return res.status(400).json({ message: "Main image is required" });
    }

    const { name, price, stock, category_id } = req.body;

    /* ================= UPLOAD MAIN IMAGE ================= */
    const mainImageFile = req.files.mainImage[0];

    const mainImageResult = await uploadBufferToCloudinary(
      mainImageFile.buffer,
      "products/main"
    );

    /* ================= CREATE PRODUCT ================= */
    const product = await Product.create({
      name,
      price: Number(price),   // ✅ convert from string
      stock: Number(stock),   // ✅ convert from string
      category_id,
      imageUrl: mainImageResult.secure_url,
    });

    /* ================= UPLOAD SUB IMAGES ================= */
    if (req.files.subImages && req.files.subImages.length > 0) {
      const subImagesData = [];

      for (const file of req.files.subImages) {
        const uploadResult = await uploadBufferToCloudinary(
          file.buffer,
          "products/sub"
        );

        subImagesData.push({
          product_id: product._id,
          image_url: uploadResult.secure_url,
        });
      }

      await ProductImage.insertMany(subImagesData);
    }

    res.status(201).json(product);
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


/* ================= GET ALL PRODUCTS ================= */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category_id", "name");

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET PRODUCT BY ID ================= */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category_id");

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const subImages = await ProductImage.find({
      product_id: req.params.id,
    });

    res.status(200).json({
      product,
      subImages,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE PRODUCT (MAIN DATA) ================= */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Delete all sub images of this product
    await ProductImage.deleteMany({ product_id: req.params.id });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADD SUB IMAGE ================= */
/* ================= ADD SUB IMAGES ================= */
export const addProductImage = async (req, res) => {
  try {
    // 🔴 THIS IS REQUIRED
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Sub images are required",
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const images = [];

    for (const file of req.files) {
      const uploadResult = await uploadBufferToCloudinary(
        file.buffer,
        "products/sub"
      );

      images.push({
        product_id: req.params.id,
        image_url: uploadResult.secure_url,
      });
    }

    const savedImages = await ProductImage.insertMany(images);

    res.status(201).json(savedImages);
  } catch (err) {
    console.error("ADD SUB IMAGE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



/* ================= DELETE SUB IMAGE ================= */
export const deleteProductImage = async (req, res) => {
  try {
    const image = await ProductImage.findByIdAndDelete(req.params.imageId);

    if (!image)
      return res.status(404).json({ message: "Image not found" });

    res.status(200).json({ message: "Sub image deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateMainImage = async (req, res) => {
  try {
    // 1️⃣ Validate image
    if (!req.file) {
      return res.status(400).json({ message: "Main image is required" });
    }

    // 2️⃣ Find product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 3️⃣ Upload new image to Cloudinary
    const uploadResult = await uploadBufferToCloudinary(
      req.file.buffer,
      "products/main"
    );

    // 4️⃣ Update product main image
    product.imageUrl = uploadResult.secure_url;
    await product.save();

    res.status(200).json({
      message: "Main image updated successfully",
      product,
    });
  } catch (err) {
    console.error("UPDATE MAIN IMAGE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
/* ================= UPDATE SUB IMAGE ================= */
export const updateSubImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Sub image is required" });
    }

    const subImage = await ProductImage.findById(req.params.imageId);
    if (!subImage) {
      return res.status(404).json({ message: "Sub image not found" });
    }

    const uploadResult = await uploadBufferToCloudinary(
      req.file.buffer,
      "products/sub"
    );

    subImage.image_url = uploadResult.secure_url;
    await subImage.save();

    res.status(200).json({
      message: "Sub image updated successfully",
      subImage,
    });
  } catch (err) {
    console.error("UPDATE SUB IMAGE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
