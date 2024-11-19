import { dir } from "console";
import fs from "fs";
import path from "path";

const createDir = (name) => {
  const dirPath = path.join("D:\\IMG_Storage", `${name}`);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // { recursive: true } để tạo nhiều thư mục con nếu cần
    console.log(`Thư mục ${dirPath} đã được tạo!`);
    return dirPath;
  } else {
    console.log(`Thư mục ${dirPath} đã tồn tại.`);
    return dirPath;
  }
};

const getfileinDir = (name) => {
  return new Promise((resolve, reject) => {
    const dirPath = path.join("D:\\IMG_Storage", `${name}`);

    // Lọc các tệp hình ảnh có trong thư mục
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        reject("Lỗi khi đọc thư mục: " + err);
        return;
      }

      // Danh sách các định dạng hình ảnh hợp lệ
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];

      // Duyệt qua tất cả các tệp trong thư mục
      const imageFiles = files.filter((file) => {
        const extname = path.extname(file).toLowerCase(); // Lấy phần mở rộng của tệp
        return imageExtensions.includes(extname); // Kiểm tra xem phần mở rộng có phải là hình ảnh không
      });

      // In danh sách các tệp hình ảnh
      if (imageFiles.length > 0) {
        console.log("Các hình ảnh trong thư mục:", imageFiles);
        resolve(imageFiles); // Trả về danh sách các hình ảnh
      } else {
        console.log("Không tìm thấy hình ảnh nào trong thư mục.");
        resolve([]); // Nếu không có hình ảnh, trả về mảng rỗng
      }
    });
  });
};
export { createDir, getfileinDir };