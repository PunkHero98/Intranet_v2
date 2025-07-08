import express from "express";
import siteController from "../app/controllers/site.controller.js";
const router = express.Router();

router.get("/teams", siteController.teams);
router.get("/activities", siteController.activity);
router.get("/homepage", siteController.homepage);
router.get("/homepage/getall", siteController.getallPage);
router.post("/homepage/:page", siteController.navigatePages);
router.get("/", siteController.homepage);

export default router;
