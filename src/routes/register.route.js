import express from "express";
import registerController from "../app/controllers/register.controller.js";
const router = express.Router();

router.get("/register-tfa", registerController.tfa);
router.get("/", registerController.register);

export default router;
