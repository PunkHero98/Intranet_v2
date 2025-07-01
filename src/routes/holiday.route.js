import express from "express";
import holidayController from "../app/controllers/holiday.controller.js";

const router = express.Router();

router.get('/vn', holidayController.getVNHoliday);
router.get('/' , holidayController.check);

export default router;