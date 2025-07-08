import express from "express";
import commentController from "../app/controllers/comment.controller.js";
import checkAuth from "../config/middleware/checkAuth.js";
const router = express.Router();


router.post('/add' , checkAuth, commentController.addComment)
router.get('/:slug' , commentController.getContentComment)
export default router;