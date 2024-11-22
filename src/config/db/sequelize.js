import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "mssql://huylam:1234@localhost:1433/Intranet_v2",
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
