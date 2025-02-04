import multer from "multer";
import path , {dirname} from "path";
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
}).array("Imgfiles", 6);

// --------------------------------------------------------------------------
const storageForUserImg = multer.memoryStorage();
const uploadforUserImg = multer({
  storage: storageForUserImg,
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
}).array("Imgfiles", 6);

const handleImageUpload = async (req, res, next) => {
  try {
    if (req.files && req.files.length > 0) {
      const { title, textcontent, imgFolderName } = req.body;
      const newTitle = title && simPliFizeString(title, true);
      const imageFiles = req.files;
      for (const file of imageFiles) {
        const resizedImageBuffer = await sharp(file.buffer)
          .resize(300, 300) // Thay đổi kích thước hình ảnh (300x300 px)
          .toFormat("jpeg") // Chuyển đổi định dạng thành JPEG
          .jpeg({ quality: 80 }) // Đặt chất lượng hình ảnh
          .toBuffer();

        const uploadPath = imgFolderName
          ? path.join("D:\\IMG_Storage\\Contents", imgFolderName)
          : createDir(
              req.session.site + "_" + req.session.username + "_" + newTitle
            );

        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        const fileName = `${Date.now() + path.extname(file.originalname)}`;
        const filePath = path.join(uploadPath, fileName);
        fs.writeFileSync(filePath, resizedImageBuffer);
      }

      next();
    } else {
      return res.status(400).json({ message: "No files uploaded" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error processing images" });
  }
};

export { upload, uploadforUserImg, handleImageUpload };
