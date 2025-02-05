import sql from "mssql";

const config = {
  server: "QSLAU-SL-SRV-22",
  database: "Intranet_v2",
  user: "huylam",
  password: "hoangduongg123",
  options: {
    trustServerCertificate: true,
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
