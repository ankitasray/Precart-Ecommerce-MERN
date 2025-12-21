import express from "express";
import cors from "cors";
import testRoutes from "./routes/test.routes.js"
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productImageRoutes from "./routes/productImage.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // 👈 frontend URL
    credentials: true,               // 👈 IMPORTANT
  })
);
app.use(express.json());
app.use("/api/test", testRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/product-images", productImageRoutes);
app.use("/api/auth", authRoutes);

export default app;
