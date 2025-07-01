import { createDocumentDir } from "../../config/middleware/filsystem.js";
import { addFolder } from "../models/comment.model.js";
import { Folder , Document } from "../models/Documents.model.js";
import fs from "fs";
import path from "path";
import { Op } from "sequelize";
import { getFolderPathById , addDocumentToFolder } from "../models/comment.model.js";
import { User } from "../models/Users.model.js";
import { History } from "../models/History.model.js";
import { getAllChildFolders } from "../services/folder.service.js";
const siteMap = {
    Vietnam: ['Global', 'VN'],
    Australia: ['Global', 'AU'],
    Thailand: ['Global', 'TH'],
    Philippines: ['Global', 'PH'],
    NewZealand: ['Global', 'NZ']
  };

// function for building tree for document
function buildTree(folders, documents) {
  const folderMap = new Map();

  const plainFolders = folders.map(f => f.get({ plain: true }));

  // Khởi tạo map và children
  plainFolders.forEach(folder => {
    folder.children = [];
    folder.documents = [];
    folderMap.set(folder.id, folder);
  });

  // Gán documents vào folder tương ứng
  documents.forEach(doc => {
    const folder = folderMap.get(doc.folderId);
    if (folder) {
      folder.documents.push(doc);
    }
  });

  // Gán children
  plainFolders.forEach(folder => {
    if (folder.parentId) {
      const parent = folderMap.get(folder.parentId);
      if (parent) {
        parent.children.push(folder);
      }
    }
  });

  // Trả về những folder gốc
  return plainFolders.filter(folder => folder.parentId === null);
}

export default new (class DocumentController {      
    // [GET] /document
    renderDocumentMainPage(req ,res ){
        const { userrole, username, fullname } = req.session;
        if(userrole !== 'Admin'){
          return res.render("documentForMem", {
            role: userrole,
            isDocumentPageForMem: true,
            username: username,
            fullname: fullname,
            site: 'Document'
        });
        }
        return res.render("document", {
            role: userrole,
            isDocumentPage: true,
            username: username,
            fullname: fullname,
            site: 'Document'
        });
    };

    // [GET] /document/getall
    async getAllDocument(req, res) {
        try{
            const folders = await Folder.findAll({});
            const documents = await Document.findAll({
              include: {
                model: User,
                as: "uploader",
                attributes: ["username" , "user_working_site"]  // chỉ lấy username
              }
            });

            return res.status(200).json({
                success: true,
                message: "Get all documents successfully",
                data: buildTree(folders, documents),
            });
        }catch(err){
            console.error("Error fetching all documents:", err);
            res.status(500).json({
                message: "Error fetching all documents",
                error: err.message,
            });
        }
    }

    //[GET] /document/site
    async getDocumentBySite(req, res) {
        try {
            const { site , userrole } = req.session;
            if(userrole !== 'Admin'){
                const rootFolderNames = siteMap[site];
                if(!rootFolderNames) return res.status(400).json({
                    success: false,
                    message: "Invalid site name",
                });

                const rootFolders = await Folder.findAll({
                    where: { name:{ [Op.in]: rootFolderNames } }
                });
                const rootIds = rootFolders.map(f => f.id);
                const subFolders = await getAllChildFolders(rootIds);
                const allFolders = [...rootFolders, ...subFolders];

                const folderIds = allFolders.map(f => f.id);
                const documents = await Document.findAll({
                  where: { folderId: { [Op.in]: folderIds } },
                  include: {
                      model: User,
                      as: "uploader",
                      attributes: ["username", "user_working_site"]
                  }
              });
                return res.status(200).json({
                    success: true,
                    message: "Get documents by site successfully",
                    data: buildTree(allFolders, documents),
                });
            };
            const folders = await Folder.findAll({});
            const documents = await Document.findAll({
              include: {
                model: User,
                as: "uploader",
                attributes: ["username" , "user_working_site"]  // chỉ lấy username
              }
            });
            return res.status(200).json({
                success: true,
                message: "Get all documents successfully",
                data: buildTree(folders, documents),
            });
        } catch (err) {
            console.error("Error fetching documents by site:", err);
            return res.status(500).json({
                success: false,
                message: "Error fetching documents by site",
                error: err.message,
            });
        }
    }

    // [POST] /document/addFolder
    async createNewFolder(req, res) {
        try {
            const { folderName, fatherId, folderPath } = req.body;
            const { idUser } = req.session;

            if (!folderName) {
                return res.status(400).json({
                    success: false,
                    message: "Folder name is required",
                });
            }

            const fullPath = fatherId && folderPath ? `${folderPath}/${folderName}` : folderName;
            const result = await createDocumentDir(fullPath);

            if (result.exist) {
                return res.status(400).json({
                    success: false,
                    message: "Folder already exists",
                    folderName: result.path,
                });
            }

            const folder = fatherId
                ? await addFolder(folderName, fatherId, idUser, result.path)
                : await addFolder(folderName, null, idUser, result.path);
            res.locals.log = {
                action: "CREATE_FOLDER",
                userId: idUser,
                folderName: folder.name, // Lưu tên thư mục để log
            };
            return res.status(200).json({
                success: true,
                message: "Create folder successfully",
                folderName: result.path,
                information: folder,
            });
        } catch (error) {
            console.error("Error creating folder:", error);
            return res.status(500).json({
                success: false,
                message: "An error occurred while creating the folder",
            });
        }
    };

    //[POST] /document/uploadFile
    async uploadFile(req, res) {
        try {
          const { folderId, fileName , fileVersion } = req.body;
          let newFolderId = folderId;
          const { idUser } = req.session;
      
          if (!req.file) {
            return res.status(400).json({
              success: false,
              message: "No file uploaded",
            });
          }
          let folderPath = './Documents';
      
          if (newFolderId === "null") {
            newFolderId = null; // không có folderId
          }else{
            folderPath = await getFolderPathById(folderId);

          }
      
          if (!folderPath) {
            return res.status(400).json({
              success: false,
              message: "Folder not found",
            });
          }
      
        //   await fs.mkdir(folderPath, { recursive: true }); // đảm bảo thư mục tồn tại
      
        const ext = path.extname(req.file.originalname); // ví dụ: .pdf, .docx
        const finalPath = path.join(folderPath, req.tempId + ext);
        await fs.promises.rename(req.file.path, finalPath);
      
        const document = await addDocumentToFolder(finalPath, fileName+ext, newFolderId,fileVersion, idUser);
        res.locals.log = {
          action: "UPLOAD_DOCUMENT",
          userId: idUser,
          documentName: document.title, // Lưu tên tài liệu để log
        };
        return res.status(200).json({
          success: true,
          message: "Upload file successfully",
          document: document,
        });
        } catch (err) {
          console.error("Error uploading file:", err);
          return res.status(500).json({
            success: false,
            message: "Error uploading file",
          });
        }
      }

    // [GET] /document/:id
      async streamDocument(req, res) {
      try {
        const pdfPath = req.pdfPath; // Phải đảm bảo middleware phía trước đã gán req.pdfPath

        if (!pdfPath || !fs.existsSync(pdfPath)) {
          return res.status(404).json({
            success: false,
            message: "PDF file not found",
          });
        }

        const fileName = path.basename(pdfPath);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);

        const fileStream = fs.createReadStream(pdfPath);
        fileStream.pipe(res);

      } catch (err) {
        console.error("Error streaming document:", err);
        return res.status(500).json({
          success: false,
          message: "Error streaming document",
        });
      }
    }

    // [DELETE] /document/delete/folder/:id
    async deleteFolder(req , res){
      try{
        const { id } = req.params;
        const folder = await Folder.findByPk(id);

        if (!folder) {
          return res.status(404).json({
            success: false,
            message: "Folder not found",
          });
        }

        // Xóa tất cả tài liệu trong thư mục
        await Document.destroy({ where: { folderId: id } });

        // Xóa thư mục trên hệ thống
        const folderPath = folder.folderPath;
        if (fs.existsSync(folderPath)) {
          fs.rmdirSync(folderPath, { recursive: true });
        }

        // Xóa thư mục khỏi cơ sở dữ liệu
        await Folder.destroy({ where: { id } });

        res.locals.log = {
          action: "DELETE_FOLDER",
          userId: req.session.idUser,
          folderName: folder.name, // Lưu tên thư mục để log
        };
        return res.status(200).json({
          success: true,
          message: "Folder deleted successfully",
        });
      }catch(err){
        console.error("Error deleting folder:", err);
        return res.status(500).json({
          success: false,
          message: "Error deleting folder",
        });
      }
    }

    // [DELETE] /document/delete/document/:id
    async deleteDocument(req, res) {
      try {
        const { id } = req.params;
        const document = await Document.findByPk(id);

        if (!document) {
          return res.status(404).json({
            success: false,
            message: "Document not found",
          });
        }

        // Xóa tệp tin trên hệ thống
        const filePath = document.filePath;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        // Xóa tài liệu khỏi cơ sở dữ liệu
        await Document.destroy({ where: { id } });

        res.locals.log = {
          action: "DELETE_DOCUMENT",
          userId: req.session.idUser,
          documentName: document.title, // Lưu tên tài liệu để log
        };
        return res.status(200).json({
          success: true,
          message: "Document deleted successfully",
        });
      } catch (err) {
        console.error("Error deleting document:", err);
        return res.status(500).json({
          success: false,
          message: "Error deleting document",
        });
      }
    }

    // [GET] /document/history
    async getDocumentHistory(req, res) {
      try {
        const histories = await History.findAll({});

        return res.status(200).json({
          success: true,
          message: "Get document history successfully",
          data: histories
        });
      } catch (err) {
        console.error("Error fetching document history:", err);
        return res.status(500).json({
          success: false,
          message: "Error fetching document history",
          error: err.message
        });
      }
    }

    // [PATCH] /document/update/:id
})();