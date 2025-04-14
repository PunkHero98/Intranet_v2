import { getCommentsByContentId , addComment } from "../models/comment.model.js";
export default new (class CommentController {
    //[GET] /comment/:slug
    async getContentComment(req , res){
        try {
            const contentId = req.params.slug;
            const result = await getCommentsByContentId(contentId);
            result.forEach((comment) => {
                comment.comment_text = Buffer.from(comment.comment_text, "base64").toString();
            });
            if (!result) {
                return res.status(404).json({ message: "No comments found for this content." });
            }
            res.status(200).json({ success: true, comments: result });
        } catch (err) {
            console.error("Error when getting comment page:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    //[POST] /comment/add
    async addComment(req, res) {
        try {
            const { contentId, commentText, parent_comment_id } = req.body;
            const userId = req.session.idUser; // Assuming user ID is stored in session
            const newCommentText = Buffer.from(commentText).toString("base64");
            const newComment = await addComment(contentId, userId, newCommentText, parent_comment_id);
            res.status(200).json({ success: true, comment: newComment });
        } catch (err) {
            console.error("Error adding comment:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }
})();