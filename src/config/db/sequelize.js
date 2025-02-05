import { Sequelize } from "sequelize";

const sequelize = new Sequelize("Intranet_v2", "huylam", "hoangduongg123", {
  host: "QSLAU-SL-SRV-22",
  dialect: "mssql",
  port: 1433,
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  },
});

export default sequelize;
