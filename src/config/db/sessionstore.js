import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import sequelize from "./sequelize.js";

const store = new (SequelizeStore(session.Store))({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 7 * 24 * 60 * 60 * 1000,
});

export default store;
