import express from "express";
import manageController from "../app/controllers/manage.controller.js";
import { upload  , newUpload , processFiles} from "../config/middleware/multer.js";
const router = express.Router();
router.post("/add_news_pics", newUpload , processFiles, manageController.uploadNewPic);
router.get('/feedback' , manageController.getFeedback);
router.post("/update", manageController.update);
router.post("/user_updated", manageController.updateUser);
router.get("/user", manageController.manageUsers);
router.get('/getall' , manageController.getAll);
router.get("/", manageController.manage);

export default router;
