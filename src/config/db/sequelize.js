import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const sequelize = new Sequelize(
  `mssql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
  {
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: true, // Nếu sử dụng kết nối SSL
      },
    },
  }
);

export default sequelize;
