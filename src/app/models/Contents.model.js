import { connectToDB, sql } from "../../config/db/index.js";
import { DataTypes } from "sequelize";
import sequelize from "../../config/db/sequelize.js";
import { User } from "./Users.model.js";

const getContents = async () => {
  const pool = await connectToDB();
  const result = await pool.request().query("SELECT * from contents");
  return result.recordset;
};

const getContentsByPage = async (offset, poster, poster_site, time, order = 'DESC') => {
  const pool = await connectToDB();
  const orderBy = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  let whereClause = `WHERE 1=1 AND deleted = 0`;
  const request = pool.request();

  // Xử lý poster
  if (poster && poster.toLowerCase() !== 'all') {
    whereClause += `AND poster LIKE @Poster `;
    request.input("Poster", sql.NVarChar, `%${poster}%`);
  }

  // Xử lý poster_site
  if (poster_site && poster_site.toLowerCase() !== 'all') {
    whereClause += `AND poster_site = @PosterSite `;
    request.input("PosterSite", sql.NVarChar, poster_site);
  }

  // Xử lý thời gian
  if (time && time !== 'null') {
    const parsedTime = new Date(time);
    if (!isNaN(parsedTime)) {
      whereClause += `AND date_time >= @Time `;
      request.input("Time", sql.DateTime, parsedTime);
    }
  }

  request.input("Offset", sql.Int, offset);

  const query = `
    SELECT *
    FROM contents
    ${whereClause}
    ORDER BY id_content ${orderBy}
    OFFSET @Offset ROWS FETCH NEXT 8 ROWS ONLY;
  `;
  const result = await request.query(query);
  return result.recordset;
};

const getTotalCountOfContent = async() => {
  const pool = await connectToDB();
  const result = await pool.request().query("SELECT COUNT(*) as total FROM contents WHERE deleted = 0");
  return result.recordset[0].total;
}


const getContentByID = async (id) => {
  const pool = await connectToDB();
  const result = (await pool)
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM contents WHERE id_content = @id");
  return (await result).recordset[0];
};

const updateContentByImageLink = async (link, imgs) => {
  const pool = await connectToDB();
  const result = await pool
    .request()
    .input("images_link", sql.NVarChar, link)
    .input("content_images", sql.NVarChar, imgs)
    .query(
      "UPDATE contents SET content_images = @content_images OUTPUT inserted.* WHERE images_link =@images_link"
    );
  return (await result).recordset;
};

const getContentsByUser = async (user) => {
  const pool = await connectToDB();
  const result = (await pool)
    .request()
    .input("user", sql.NVarChar, user)
    .query("SELECT * FROM contents WHERE poster = @user");
  return (await result).recordset;
};

const getContentsBySite = async (site) => {
  const pool = await connectToDB();
  const result = (await pool)
    .request()
    .input("site", sql.NVarChar, site)
    .query("SELECT * FROM contents WHERE poster_site = @site");
  return (await result).recordset;
};

const addContent = async (
  title,
  content,
  images_link,
  content_images,
  content_file,
  user,
  date_created,
  site
) => {
  const pool = await connectToDB();
  const result = await pool
    .request()
    .input("title", sql.NVarChar, title)
    .input("content", sql.NVarChar, content)
    .input("images_link", sql.NVarChar, images_link)
    .input("content_images", sql.NVarChar, content_images)
    .input('content_file' , sql.NVarChar , content_file)
    .input("poster", sql.NVarChar, user)
    .input("dateandtime", sql.DateTime, date_created)
    .input("last_update", sql.DateTime, null)
    .input("deleted", sql.Bit, 0)
    .input("poster_site", sql.NVarChar, site)
    .query(
      "INSERT INTO contents (title , content, images_link , content_images, content_file , poster , date_time , last_updated , deleted , poster_site) VALUES (@title , @content ,@images_link, @content_images, @content_file , @poster , @dateandtime , @last_update , @deleted ,@poster_site)"
    );
  return (await result).rowsAffected;
};

const updateContents = async (records) => {
  // Tạo kết nối chung, tránh tạo kết nối cho mỗi record
  const pool = await connectToDB();

  // Duyệt qua từng record và thực hiện truy vấn UPDATE
  const queryPromises = records.map((record) => {
    return pool
      .request()
      .input("id_content", sql.Int, record.id_content)
      .input("title", sql.NVarChar, record.title)
      .input("content", sql.NVarChar, record.content)
      .input("images_link", sql.NVarChar, record.images_link || null)
      .input("content_images", sql.NVarChar, record.content_images || null)
      .input("poster", sql.NVarChar, record.poster)
      .input("date_time", sql.DateTime, record.date_time)
      .input("last_update", sql.DateTime, record.last_updated || null) // Nếu không có giá trị thì truyền null
      .input(
        "deleted",
        sql.Bit,
        record.deleted != undefined ? record.deleted : 0
      ) // Nếu không có giá trị, gán mặc định 0
      .input("poster_site", sql.NVarChar, record.poster_site)
      .query(
        "UPDATE contents SET title = @title, content = @content, images_link = @images_link, content_images = @content_images, poster = @poster, date_time = @date_time, last_updated = @last_update, deleted = @deleted, poster_site = @poster_site WHERE id_content = @id_content"
      );
  });

  // Chạy tất cả các truy vấn song song và đợi kết quả
  const results = await Promise.all(queryPromises);

  // Trả về kết quả rowsAffected cho từng record
  return results.map((result) => result.rowsAffected);
};

const ContentLike = sequelize.define("ContentLike", {
  content_id: DataTypes.INTEGER,
  user_id: DataTypes.INTEGER,
  liked_at: DataTypes.DATE,
});

const ContentView = sequelize.define("ContentView", {
  content_id: DataTypes.INTEGER,
  user_id: DataTypes.INTEGER,
  ip_address: DataTypes.STRING,
  viewed_at: DataTypes.DATE,
});

const ContentComment = sequelize.define("ContentComment", {
  content_id: DataTypes.INTEGER,
  user_id: DataTypes.INTEGER,
  comment_text: DataTypes.TEXT,
  parent_comment_id: DataTypes.INTEGER,
  created_at: DataTypes.DATE,
  is_deleted: DataTypes.BOOLEAN,
});



const getContentStats = async (contentId) =>{
  const [likes, views, comments] = await Promise.all([
    ContentLike.count({ where: { content_id: contentId } }),
    ContentView.count({ where: { content_id: contentId } }),
    ContentComment.count({ 
      where: { content_id: contentId, is_deleted: false } 
    }),
  ]);

  return {
    total_likes: likes,
    total_views: views,
    total_comments: comments,
  };
}

const addContentView = async (content_id, user_id = null) => {
  try {
    await ContentView.create({
      content_id,
      user_id,
      viewed_at: new Date(),
    });
    console.log("✅ View recorded");
  } catch (error) {
    console.error("❌ Error recording view:", error);
  }
};



export {
  getContents,
  getContentByID,
  getContentsBySite,
  getContentsByUser,
  getContentsByPage,
  addContent,
  updateContents,
  updateContentByImageLink,
  getTotalCountOfContent,
  getContentStats,
  addContentView,
  ContentLike,
  ContentComment,
  ContentView,
};
