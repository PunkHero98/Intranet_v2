import express from "express";
import siteController from "../app/controllers/site.controller.js";
const router = express.Router();

router.use("/teams", siteController.teams);
router.use("/", siteController.homepage);

export default router;
