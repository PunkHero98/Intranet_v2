import express from "express";
import commentController from "../app/controllers/comment.controller.js";
const router = express.Router();

router.post('/add' , commentController.addComment)
router.get('/:slug' , commentController.getContentComment)
export default router;