import express from "express";
import contentController from "../app/controllers/content.controller.js";
import { upload , newUpload , processFiles } from "../config/middleware/multer.js";
const router = express.Router();
router.get("/add-news", contentController.getAddpage);
router.post("/add", newUpload , processFiles, contentController.add);
router.post('/download' , contentController.download);
router.put("/:slug/edit");
router.delete("/:slug");
router.get("/:slug", contentController.show);

export default router;
