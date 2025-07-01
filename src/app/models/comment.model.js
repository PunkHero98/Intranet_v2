import {User } from "./Users.model.js";
import { ContentComment } from "./Contents.model.js";
import { Document , Approval , DocumentAccess , Folder } from "./Documents.model.js";


User.hasMany(ContentComment, {
    foreignKey: 'user_id',
    sourceKey: 'id_user',
  });

ContentComment.belongsTo(User, {
  foreignKey: 'user_id',    // cột trong ContentComment
  targetKey: 'id_user',     // cột trong User
});

// // User - Document
User.hasMany(Document, { foreignKey: "uploadedBy" });
Document.belongsTo(User, { foreignKey: "uploadedBy", as: "uploader" });

// // Document - Folder
Folder.hasMany(Document, { foreignKey: "folderId" });
Document.belongsTo(Folder, { foreignKey: "folderId" });

// // User - Folder
User.hasMany(Folder, { foreignKey: "createdBy" });
Folder.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// // Document - DocumentAccess
Document.hasMany(DocumentAccess, { foreignKey: "documentId" });
DocumentAccess.belongsTo(Document, { foreignKey: "documentId" });

// // Document - Approval
Document.hasMany(Approval, { foreignKey: "documentId" });
Approval.belongsTo(Document, { foreignKey: "documentId" });


const getCommentsByContentId = async (contentId) => {
    const comments = await ContentComment.findAll({
      where: { content_id: contentId, is_deleted: false },
      include: [
        {
          model: User,
          attributes: ["username", "fullname" , "user_working_site"],
        },
      ],
    });
    return comments;
  }

const addComment = async (contentId, userId, commentText , parent_comment_id) => {
    const newComment = await ContentComment.create({
      content_id: contentId,
      user_id: userId,
      comment_text: commentText,
      parent_comment_id: parent_comment_id || null, // Assuming top-level comment
      created_at: new Date(),
      is_deleted: false,
    });
    return newComment;
  };

const addFolder = async (folderName, parentId, createdBy , folderPath) => {
    const newFolder = await Folder.create({
        name: folderName,
        parentId: parentId || null, // Assuming top-level folder
        folderPath: folderPath || null,
        createdBy: createdBy,
        createdAt: new Date(),
    });
    return newFolder;
};

//model to get folderPath by folderId
const getFolderPathById = async (folderId) => {
    const folder = await Folder.findOne({
        where: { id: folderId },
        attributes: ['folderPath'],
    });
    return folder ? folder.folderPath : null;
};

//add new document 
const addDocumentToFolder = async (filePath , fileName , folderId ,fileVersion,  uploadedBy) => {
    const newDocument = await Document.create({
        title: fileName,
        filePath: filePath,
        fileName: fileName,
        folderId: folderId,
        version: fileVersion, // Default version if not provided
        uploadedBy: uploadedBy,
        createdAt: new Date(),
    });
    return newDocument;
};

//get document path by documentId
const getDocumentPathById = async (documentId) => {
    const document = await Document.findOne({
        where: { id: documentId },
        attributes: ['filePath'],
    });
    return document ? document.filePath : null;
};
export { getCommentsByContentId , addComment , addFolder , getFolderPathById , addDocumentToFolder , getDocumentPathById };