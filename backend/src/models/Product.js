import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imageUrl: String,
  is_active: { type: Boolean, default: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
