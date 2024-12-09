import { connectToDB, sql } from "../../config/db/index.js";

const getContents = async () => {
  const pool = await connectToDB();
  const result = await pool.request().query("SELECT * from contents");
  return result.recordset;
};

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
    .input("poster", sql.NVarChar, user)
    .input("dateandtime", sql.DateTime, date_created)
    .input("last_update", sql.DateTime, null)
    .input("deleted", sql.Bit, 0)
    .input("poster_site", sql.NVarChar, site)
    .query(
      "INSERT INTO contents (title , content, images_link , content_images , poster , date_time , last_updated , deleted , poster_site) VALUES (@title , @content ,@images_link, @content_images , @poster , @dateandtime , @last_update , @deleted ,@poster_site)"
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
      .input("images_link", sql.NVarChar, record.images_link)
      .input("content_images", sql.NVarChar, record.content_images)
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

export {
  getContents,
  getContentByID,
  getContentsBySite,
  getContentsByUser,
  addContent,
  updateContents,
  updateContentByImageLink,
};
