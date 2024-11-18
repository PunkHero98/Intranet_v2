import session from "express-session";
import SequelizeStore from "connect-session-sequelize"; // Import `connect-session-sequelize`
import sequelize from "./sequelize.js"; // Import instance sequelize đã cấu hình

// Tạo Sequelize store từ express-session
const store = new (SequelizeStore(session.Store))({
  db: sequelize, // Đảm bảo bạn đã truyền đúng instance của Sequelize
  checkExpirationInterval: 15 * 60 * 1000, // Kiểm tra session hết hạn mỗi 15 phút
  expiration: 7 * 24 * 60 * 60 * 1000, // Session hết hạn sau 7 ngày
});

export default store;
