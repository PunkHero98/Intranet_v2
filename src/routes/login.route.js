import express from "express";
import loginController from "../app/controllers/login.controller.js";
const router = express.Router();

router.post("/", loginController.verify);
router.get("/", loginController.login);

export default router;
