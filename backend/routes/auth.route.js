import express from "express";
import { signup, signin, logout, checkAuth } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/check-auth",checkAuth);
router.post("/logout", logout);

export default router;
