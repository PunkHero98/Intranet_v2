import { connectToDB , sql } from "../../config/db/index.js";

const addFeedBack = async (data) => {
    const pool = await connectToDB();
    const result = await pool
      .request()
      .input("username", sql.NVarChar, data.username)
      .input("user_site", sql.NVarChar, data.user_site)
      .input("category", sql.NVarChar, data.category)
      .input("message", sql.NVarChar, data.message)
      .input("images_link", sql.NVarChar, data.images_link)
      .input("feedback_images", sql.NVarChar, data.feedback_images)
      .input("is_clear", sql.Bit, data.is_clear ?? false) // default false nếu không truyền
      .query(`
        INSERT INTO feedback (
          username, user_site, category, message,
          images_link, feedback_images, is_clear
        )
        VALUES (
          @username, @user_site, @category, @message,
          @images_link, @feedback_images, @is_clear
        )
      `);
    return result.rowsAffected;
  };
  
const getAllFeedBack = async (data) => {
    const pool = await connectToDB();
    const result = await pool
      .request()
      .query(`
        SELECT * FROM feedback
      `);
    return result.recordset;
  }
  export { addFeedBack , getAllFeedBack };