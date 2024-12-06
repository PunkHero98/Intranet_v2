import sql from "mssql";
import dotevn from "dotenv";
dotevn.config();

const config = {
  server: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    trustServerCertificate: true,
    trustedConnection: true,
  },
  port: 1433,
};

const connectToDB = async () => {
  try {
    const pool = await sql.connect(config);
    console.log("Connected to SQL Server");
    return pool;
  } catch (err) {
    console.error("Database connection failed", err);
    throw err;
  }
};

export { connectToDB, sql };
