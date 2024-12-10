import multer from "multer";
import path from "path";
import { createDir } from "./filsystem.js";
import { simPliFizeString } from "./assets.js";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { title, textcontent, imgFolderName } = req.body;
    const newTitle = title && simPliFizeString(title, true);
    cb(
      null,
      imgFolderName
        ? path.join("D:\\IMG_Storage", imgFolderName)
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
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file là 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
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

export { upload };
