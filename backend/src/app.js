import express from "express";
import cors from "cors";
import testRoutes from "./routes/test.routes.js"
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productImageRoutes from "./routes/productImage.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import path from "path";
import addressRoutes from "./routes/addressRoutes.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js"
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // 👈 frontend URL
    credentials: true,               // 👈 IMPORTANT
  })
);
app.use(cookieParser());
app.use(express.json()); // for JSON
app.use(express.urlencoded({ extended: true }));
app.use("/api/test", testRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/product-images", productImageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/address", addressRoutes);
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

export default app;
