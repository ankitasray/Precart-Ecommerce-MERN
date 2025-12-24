import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    // parentId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Category",
    //   default: null
    // }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Category", categorySchema);
