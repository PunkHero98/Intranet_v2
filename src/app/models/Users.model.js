import { connectToDB, sql } from "../../config/db/index.js";

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
const checkUserByEmail = async (email) => {
  const pool = await connectToDB();
  const result = await pool
    .request()
    .input("email", sql.NVarChar, email)
    .query("SELECT * from users where email = @email");
  return result.recordset.length > 0 ? result.recordset[0] : null;
};
const getUserById = async (id) => {
  const pool = await connectToDB();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * from users where id_user = @id");
  return result.recordset.length > 0 ? result.recordset[0] : null;
};

const updateUser = async (email, user_role, user_working_site, isActived) => {
  const pool = await connectToDB();
  const result = await pool
    .request()
    .input("email", sql.NVarChar, email)
    .input("user_role", sql.NVarChar, user_role)
    .input("user_working_site", sql.NVarChar, user_working_site)
    .input("isActived", sql.Bit, isActived)
    .query(
      "UPDATE users SET user_role = @user_role, user_working_site = @user_working_site,  isActived = @isActived WHERE email = @email"
    );
  return result.rowsAffected;
};

const updateUserWithPass = async (
  email,
  user_role,
  user_working_site,
  isActived,
  password
) => {
  const pool = await connectToDB();
  const result = await pool
    .request()
    .input("email", sql.NVarChar, email)
    .input("user_role", sql.NVarChar, user_role)
    .input("user_working_site", sql.NVarChar, user_working_site)
    .input("user_password", sql.NVarChar, password)
    .input("isActived", sql.Bit, isActived)
    .query(
      "UPDATE users SET user_password = @user_password, user_role = @user_role, user_working_site = @user_working_site,  isActived = @isActived WHERE email = @email"
    );
  return result.rowsAffected;
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
    .input("isActived", sql.Bit, 1)
    .query(
      "INSERT INTO users ( username, fullname ,email,user_password,user_role,department,position,user_working_site,user_address,office_phone_number,isActived) VALUES ( @username, @fullname ,@email,@user_password,@user_role,@department,@position,@user_working_site,@user_address,@office_phone_number,@isActived)"
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

export {
  getUsers,
  getUserByEmail,
  createUser,
  deleteUser,
  getUserById,
  checkUserByEmail,
  updateUser,
  updateUserWithPass,
};
