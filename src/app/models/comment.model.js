import {User } from "./Users.model.js";
import { ContentComment } from "./Contents.model.js";


User.hasMany(ContentComment, {
    foreignKey: 'user_id',
    sourceKey: 'id_user',
  });

ContentComment.belongsTo(User, {
  foreignKey: 'user_id',    // cột trong ContentComment
  targetKey: 'id_user',     // cột trong User
});

const getCommentsByContentId = async (contentId) => {
    const comments = await ContentComment.findAll({
      where: { content_id: contentId, is_deleted: false },
      include: [
        {
          model: User,
          attributes: ["username", "fullname"],
        },
      ],
    });
    return comments;
  }

const addComment = async (contentId, userId, commentText , parent_comment_id) => {
    const newComment = await ContentComment.create({
      content_id: contentId,
      user_id: userId,
      comment_text: commentText,
      parent_comment_id: parent_comment_id || null, // Assuming top-level comment
      created_at: new Date(),
      is_deleted: false,
    });
    return newComment;
  }
export { getCommentsByContentId , addComment};