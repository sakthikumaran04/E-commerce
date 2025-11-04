import express from "express";
import { simpleSearch, elasticSearch } from "../controllers/search.controller.js";
import {verifyToken} from "../middlewares/auth.middleware.js"

const router = express.Router();

router.get("/simple", verifyToken ,simpleSearch); // → MySQL
router.get("/elastic", verifyToken, elasticSearch); // → Elasticsearch

export default router;
