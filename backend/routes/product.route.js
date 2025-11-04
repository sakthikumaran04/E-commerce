import express from "express";
import { addProduct, getProductById, getProducts, upload } from "../controllers/product.controller.js";
import {verifyToken} from "../middlewares/auth.middleware.js"

const router = express.Router();

// POST /api/products  → Add product
router.post("/", upload.single("image"), addProduct);

// GET /api/products?page=1 → Get paginated products
router.get("/",getProducts);
router.get("/:id", verifyToken, getProductById); 


export default router;
