import express from "express";
import contentController from "../app/controllers/content.controller.js";
import { upload , newUpload , processFiles } from "../config/middleware/multer.js";
import checkAuth from "../config/middleware/checkAuth.js";
const router = express.Router();

router.get("/add-news",checkAuth, contentController.getAddpage);
router.post("/add",checkAuth , newUpload , processFiles, contentController.add);
router.post('/download' , contentController.download);
// router.put("/:slug/like" , contentController.likeContent);
router.post("/like" ,checkAuth, contentController.likeContent);
router.delete("/:slug");
router.get("/:slug", contentController.show);

export default router;
