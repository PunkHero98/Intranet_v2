//History model
import sequelize from "../../config/db/sequelize.js";
import { DataTypes } from "sequelize";

const History = sequelize.define("History", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  action: { type: DataTypes.STRING, allowNull: false }, // Ex: "delete", "upload"
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: {
      model: 'users',
      key: 'id_user'
    }
  },
  documentName: { // ← chỉ lưu tên tài liệu thôi
    type: DataTypes.STRING,
    allowNull: true
  },
  folderName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: { // mô tả chi tiết hành động
        type: DataTypes.TEXT,
        allowNull: true
    },
extraInfo: {
    type: DataTypes.TEXT, // Hoặc JSONB nếu dùng PostgreSQL
    allowNull: true
    },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Histories',
  timestamps: false
});


export {History} ;