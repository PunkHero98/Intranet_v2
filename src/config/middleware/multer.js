import multer from "multer";
import path, { dirname } from "path";
import { createDir } from "./filsystem.js";
import { simPliFizeString } from "./assets.js";
import sharp from "sharp";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { title, textcontent, imgFolderName } = req.body;
    const newTitle = title && simPliFizeString(title, true);
    cb(
      null,
      imgFolderName
        ? path.join("./IMG_Storage", imgFolderName)
        : createDir(
            req.session.site + "_" + req.session.username + "_" + newTitle
          )
    );
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước file là 10MB
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
}).array("Imgfiles", 20);

// --------------------------------------------------------------------------
const storageForNewUpload = multer.memoryStorage();
const newUpload = multer({
  storage: storageForNewUpload,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file là 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|webp|heif|svg/;
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
}).array("Imgfiles", 20);

const processImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  try {
    const { title, imgFolderName } = req.body;
    const newTitle = title && simPliFizeString(title, true);
    const uploadPath = imgFolderName
      ? path.join("./IMG_Storage", imgFolderName)
      : createDir(req.session.site + "_" + req.session.username + "_" + newTitle);

    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Duyệt qua từng file và xử lý
    const processedFiles = await Promise.all(
      req.files.map(async (file) => {
        const newFileName = `${Date.now()}.jpeg`; // Chuyển sang JPEG
        const outputPath = path.join(uploadPath, newFileName);

        await sharp(file.buffer)
          .jpeg({ quality: 80 , progressive: true}) // Chuyển sang JPEG với chất lượng 80%
          .toFile(outputPath);

        return { originalName: file.originalname, savedAs: newFileName };
      })
    );

    req.processedFiles = processedFiles; // Lưu thông tin file đã xử lý vào request
    next(); // Tiếp tục middleware tiếp theo
  } catch (err) {
    console.error("Image processing error:", err);
    return res.status(500).json({ error: "Error processing images" });
  }
};

export { upload, newUpload, processImages };
