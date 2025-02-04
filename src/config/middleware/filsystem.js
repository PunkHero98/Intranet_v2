import fs from "fs";
import path , {dirname} from "path";


const createDir = (name) => {
  const dirPath = path.join("./IMG_Storage\\Contents", `${name}`);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Thư mục ${dirPath} đã được tạo!`);
    return dirPath;
  } else {
    console.log(`Thư mục ${dirPath} đã tồn tại.`);
    return dirPath;
  }
};

const getfileinDir = (name) => {
  return new Promise((resolve, reject) => {
    const dirPath = path.join("./IMG_Storage", `${name}`);
    console.log(dirPath);
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        reject("Lỗi khi đọc thư mục: " + err);
        return;
      }
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".heif",
        ".svg",
      ];
      const imageFiles = files.filter((file) => {
        const extname = path.extname(file).toLowerCase();
        return imageExtensions.includes(extname);
      });
      if (imageFiles.length > 0) {
        console.log("Các hình ảnh trong thư mục:", imageFiles);
        resolve(imageFiles);
      } else {
        console.log("Không tìm thấy hình ảnh nào trong thư mục.");
        resolve([]);
      }
    });
  });
};

const updateImageinFolder = async (array) => {
  try {
    for (const item of array) {
      const dirPath = path.join("./IMG_Storage", item.images_link);
      const files = await fs.promises.readdir(dirPath);

      const newImageContent = JSON.parse(item.content_images);
      const filesToDelete = files.filter(
        (file) => !newImageContent.includes(file)
      );

      for (const file of filesToDelete) {
        const filePath = path.join(dirPath, file);

        try {
          await fs.promises.unlink(filePath);
          console.log(`Đã xóa file ${file}`);
        } catch (err) {
          console.error(`Không thể xóa file ${file}: ${err}`);
        }
      }
    }
    console.log("Xử lý hoàn tất!");
  } catch (error) {
    console.error("Lỗi khi xử lý:", error);
  }
};
export { createDir, getfileinDir, updateImageinFolder };
