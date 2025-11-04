import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import pool from "./db.js";
import authRoutes from "./routes/auth.route.js"
import categoryRoutes from "./routes/category.route.js";
import productRoutes from "./routes/product.route.js";
import searchRoutes from "./routes/search.route.js";
import path from "path";
import { fileURLToPath } from "url";


dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true                
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/categories",categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/search", searchRoutes);

app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS currentTime");
    res.json({ message: "Backend working ✅", time: rows[0].currentTime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database not connected ❌" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
