import express from "express";
import feedBackController from "../app/controllers/feedBack.controller.js";
import { upload , newUpload , processFiles , conditionalUpload} from "../config/middleware/multer.js";
const router = express.Router();
router.get('/getall', feedBackController.getAllFeedBack);
router.post("/", conditionalUpload, feedBackController.getFeedBack);


export default router;
