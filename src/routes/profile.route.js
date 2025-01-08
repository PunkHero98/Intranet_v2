import express from "express";
import profileController from "../app/controllers/profile.controller.js";
const router = express.Router();

router.get("/", profileController.profile);

export default router;
