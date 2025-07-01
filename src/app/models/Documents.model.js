import { DataTypes } from "sequelize";
import sequelize from "../../config/db/sequelize.js";

const Folder = sequelize.define("folder", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    parentId: { type: DataTypes.INTEGER, allowNull: true },
    folderPath: { type: DataTypes.STRING, allowNull: true },
    createdBy: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: "folders",
    timestamps: false,
    freezeTableName: true
  });

  
const Document = sequelize.define("document", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    fileName: { type: DataTypes.STRING, allowNull: false },
    filePath: { type: DataTypes.STRING, allowNull: false },
    folderId: { type: DataTypes.INTEGER, allowNull: true },
    version: { type: DataTypes.STRING, allowNull: true },
    uploadedBy: { type: DataTypes.INTEGER, allowNull: false },
    approvedBy: { type: DataTypes.INTEGER, allowNull: true },
    status: { 
      type: DataTypes.ENUM("pending", "approved", "rejected"), 
      defaultValue: "pending" 
    },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: "documents",
    timestamps: false,
    freezeTableName: true
  });

const DocumentVersionHistory = sequelize.define("document_version_history", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    documentId: { type: DataTypes.INTEGER, allowNull: false },
    documentName: { type: DataTypes.STRING, allowNull: false },
    version: { type: DataTypes.STRING, allowNull: false },
    filePath: { type: DataTypes.STRING, allowNull: false },
    uploadedBy: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: "document_version_history",
    timestamps: false,
    freezeTableName: true
  });

const DocumentAccess = sequelize.define("document_access", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    documentId: { type: DataTypes.INTEGER, allowNull: false },
    accessType: { type: DataTypes.ENUM("role", "user"), allowNull: false },
    accessValue: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: "document_access",
    timestamps: false,
    freezeTableName: true
  });

const Approval = sequelize.define("approval", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    documentId: { type: DataTypes.INTEGER, allowNull: false },
    requestedBy: { type: DataTypes.INTEGER, allowNull: false },
    requestedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    approvedBy: { type: DataTypes.INTEGER, allowNull: true },
    status: { 
      type: DataTypes.ENUM("pending", "approved", "rejected"), 
      defaultValue: "pending" 
    },
    comment: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: "approvals",
    timestamps: false,
    freezeTableName: true
  });

  
export {
  Folder,
  Document,
  DocumentAccess,
  Approval
};