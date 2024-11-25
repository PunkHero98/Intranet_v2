import express from "express";
import siteController from "../app/controllers/site.controller.js";
const router = express.Router();

router.get("/teams", siteController.teams);
router.post("/activities", siteController.activity);
router.get("/homepage", siteController.homepage);
router.get("/profile", siteController.profile);
router.get("/manage", siteController.manage);
router.get("/", siteController.redirecT);

export default router;
