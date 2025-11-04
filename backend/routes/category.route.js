import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { addCategory, getCategories, getCategoryById } from "../controllers/category.controller.js";
import {verifyToken} from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/add-category",verifyToken, upload.single("image"), addCategory);
router.get("/", verifyToken ,getCategories);
router.get("/:id", verifyToken,getCategoryById);

export default router;
