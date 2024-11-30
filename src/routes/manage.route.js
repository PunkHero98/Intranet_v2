import express from "express";
import manageController from "../app/controllers/manage.controller.js";
const router = express.Router();

router.post("/update", manageController.update);
router.get("/", manageController.manage);

export default router;
