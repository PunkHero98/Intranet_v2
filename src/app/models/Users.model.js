import { connectToDB, sql } from "../../config/db/index.js";
import { v4 as uuidv4 } from "uuid";

const getUsers = async () => {
  const pool = await connectToDB();
  const result = await pool.request().query("SELECT * from users");
  return result.recordset;
};

const getUserByEmail = async (email, password) => {
  const pool = await connectToDB();
  const result = await pool
    .request()
    .input("email", sql.NVarChar, email)
    .input("password", sql.NVarChar, password)
    .query(
      "SELECT * from users where email = @email and user_password = @password"
    );
  return result.recordset.length > 0 ? result.recordset[0] : null;
};

const createUser = async (
  fullname,
  email,
  password,
  role,
  department,
  position,
  site,
  address,
  phonenumber
) => {
  const pool = await connectToDB();
  const result = await pool
    .request()
    .input("id_user", sql.NVarChar, uuidv4())
    .input("username", sql.NVarChar, email.split("@")[0])
    .input("fullname", sql.NVarChar, fullname)
    .input("email", sql.NVarChar, email)
    .input("user_password", sql.NVarChar, password)
    .input("user_role", sql.NChar, role)
    .input("department", sql.NVarChar, department)
    .input("position", sql.NVarChar, position)
    .input("user_working_site", sql.NVarChar, site)
    .input("user_address", sql.NVarChar, address)
    .input("office_phone_number", sql.NVarChar, phonenumber)
    .input("isActived", sql.Bit, 0)
    .query(
      "INSERT INTO users (id_user, username, fullname ,email,user_password,user_role,department,position,user_working_site,user_address,office_phone_number,isActived) VALUES (@id_user, @username, @fullname ,@email,@user_password,@user_role,@department,@position,@user_working_site,@user_address,@office_phone_number,@isActived)"
    );
  return result.rowsAffected;
};

const deleteUser = async (id) => {
  const pool = await connectToDB();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM users WHERE id = @id");
  return result.rowsAffected;
};

export { getUsers, getUserByEmail, createUser, deleteUser };
