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

// const sequelize = new Sequelize("Intranet_v2", "huylam", "1234", {
//   host: "QSLVN-LT-DEV001\\SQLEXPRESS",
//   dialect: "mssql",
//   port: 1433,
//   dialectOptions: {
//     options: {
//       encrypt: true,
//       trustServerCertificate: true,
//     },
//   },
// });

export default sequelize;
