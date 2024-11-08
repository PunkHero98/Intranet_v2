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

const getContentsByUser = async (user) => {
  const pool = await connectToDB();
  const result = (await pool)
    .request()
    .input("user", sql.NVarChar, user)
    .query("SELECT * FROM contents WHERE poster = @user");
  return result.recordset;
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
  image_link,
  user,
  date_created,
  site
) => {
  const pool = await connectToDB();
  const result = (await pool)
    .request()
    .input("title", sql.NVarChar, title)
    .input("content", sql.NVarChar, content)
    .input("content_image", sql.NVarChar, image_link)
    .input("poster", sql.NVarChar, user)
    .input("dateandtime", sql.DateTime2, date_created)
    .input("last_update", sql.DateTime2, null)
    .input("deleted", sql.Bit, 0)
    .input("poster_site", sql.NVarChar, site)
    .query(
      "INSERT INTO contents (title , content, content_image , poster , date_time , last_updated , deleted , poster_site) VALUES (@title , @content , @content_image , @poster , @dateandtime , @last_update , @deleted ,@poster_site)"
    );
  return result.rowsAffected;
};

export {
  getContents,
  getContentByID,
  getContentsBySite,
  getContentsByUser,
  addContent,
};
