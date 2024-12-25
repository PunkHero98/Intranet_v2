import express from "express";
import registerController from "../app/controllers/register.controller.js";
const router = express.Router();

router.post("/tfa", registerController.tfa);
router.post("/check-email", registerController.checkEmail);
router.get("/", registerController.register);

export default router;
