import express from "express";
import manageController from "../app/controllers/manage.controller.js";
import { upload } from "../config/middleware/multer.js";
const router = express.Router();
router.post("/add_news_pics", upload, manageController.uploadNewPic);
router.post("/update", manageController.update);
router.get("/", manageController.manage);

export default router;
