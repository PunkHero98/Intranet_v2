import express from "express";
import contentController from "../app/controllers/content.controller.js";
import { upload } from "../config/middleware/multer.js";
const router = express.Router();
router.post("/add", upload, contentController.add);
router.get("/:slug", contentController.show);

export default router;
