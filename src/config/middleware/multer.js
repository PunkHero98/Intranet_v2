import multer from "multer";
import path from "path";
import { createDir , createFeedbackDir} from "./filsystem.js";
import { simPliFizeString } from "./assets.js";
import sharp from "sharp";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { fb_category, fb_message } = req.body;
    const uniqueId = uuidv4(12);
    req.feedbackId = uniqueId;
    // const newTitle = title && simPliFizeString(title, true);
    cb(
      null, createFeedbackDir(
            req.session.username + "_" + uniqueId
          )
    );
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Giới hạn kích thước file là 10MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|webp|heif|svg/;
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
}).array("feedback_images", 3);

const conditionalUpload = (req, res, next) => {
  // kiểm tra theo form-data luôn chứa trường `feedback_images`
  // ta để multer xử lý trước, rồi kiểm tra sau
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ message: err.message });
    }

    // Nếu không có file nào thì tiếp tục mà không lỗi
    if (!req.files || req.files.length === 0) {
      console.log("No files uploaded, skipping file processing.");
      return next();
    }

    // Có file hợp lệ => tiếp tục
    return next();
  });
};
// --------------------------------------------------------------------------
const storageForNewUpload = multer.memoryStorage();
const newUpload = multer({
  storage: storageForNewUpload,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn file 10MB
  fileFilter: (req, file, cb) => {
    const imageTypes = /jpeg|jpg|png|gif|webp|heif|svg/;
    const docTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt/;
    
    const mimeType = imageTypes.test(file.mimetype) || docTypes.test(file.mimetype);
    const extName = imageTypes.test(path.extname(file.originalname).toLowerCase()) ||
                    docTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb(new Error("Only images and documents are allowed!"), false);
    }
  },
}).fields([
  { name: "Imgfiles", maxCount: 10 }, // Tối đa 20 ảnh
  { name: "Docfiles", maxCount: 3 }, // Tối đa 10 file tài liệu
]);

const processFiles = async (req, res, next) => {
  if ((!req.files.Imgfiles || req.files.Imgfiles.length === 0) && 
      (!req.files.Docfiles || req.files.Docfiles.length === 0)) {
        console.log("No files uploaded, skipping file processing.");
        return next();
  }

  try {
    const { title, imgFolderName } = req.body;
    const folderId = uuidv4(15);
    req.folderId = folderId;
    const newTitle = title && simPliFizeString(title, true);
    const uploadPath = imgFolderName
      ? path.join("./IMG_Storage", imgFolderName)
      : createDir(req.session.site + "_" + req.session.username + "_" + folderId);

    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    let processedFiles = [];

    // Xử lý ảnh
    if (req.files.Imgfiles) {
      for (const file of req.files.Imgfiles) {
        try {
          const newFileName = `${uuidv4()}.jpeg`;
          const outputPath = path.join(uploadPath, newFileName);

          await sharp(file.buffer)
            .jpeg({ quality: 80, progressive: true })
            .toFile(outputPath);

          processedFiles.push({ type: "image", originalName: file.originalname, savedAs: newFileName });
        } catch (error) {
          console.error(`Error processing image ${file.originalname}:`, error);
        }
      }
    }

    // Lưu file tài liệu trực tiếp
    if (req.files.Docfiles) {
      for (const file of req.files.Docfiles) {
        try {
          const newFileName = `${file.originalname}`;
          console.log(newFileName , '-------------------------------------')
          const outputPath = path.join(uploadPath, newFileName);
          fs.writeFileSync(outputPath, file.buffer);

          processedFiles.push({ type: "document", originalName: file.originalname, savedAs: newFileName });
        } catch (error) {
          console.error(`Error saving document ${file.originalname}:`, error);
        }
      }
    }

    req.processedFiles = processedFiles;
    next();
  } catch (err) {
    console.error("File processing error:", err);
    return res.status(500).json({ error: "Error processing files" });
  }
};


export { upload, newUpload, processFiles , conditionalUpload };
