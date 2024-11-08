import express from "express";
import siteController from "../app/controllers/site.controller.js";
const router = express.Router();

router.get("/teams", siteController.teams);
router.post("/activities", siteController.activity);
router.get("/", siteController.homepage);

export default router;
