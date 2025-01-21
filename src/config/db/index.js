import sql from "mssql";

const config = {
  server: "localhost",
  database: "Intranet_v2",
  user: "huylam",
  password: "1234",
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
