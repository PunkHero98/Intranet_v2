import path from 'path';
export const totalindex = (value) => value;

export const addindex = (value) => value + 1;

export const forHelper = (from, to, block) => {
  let result = "";
  for (let i = from; i <= to; i++) {
    result += block.fn(i);
  }
  return result;
};

export const compare = function (value1, value2, options) {
  if (value1 === value2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

export const eq = function(a, b) {
  console.log("Compare:", a, b);
  return a === b;
};

const truncateFilename = function(filename){
  return filename.length > 15 ? filename.substring(15, filename.length) + '...' : filename;
}

const endsWith = function(str , suffix) {
  if (typeof str !== 'string') return false;  // Đảm bảo str là chuỗi
    return str.toLowerCase().endsWith(suffix.toLowerCase());
}
const getFileType = function(filename){
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".pdf") return "fa-file-pdf text-danger";
  if (ext === ".doc" || ext === ".docx") return "fa-file-word text-primary";
  if (ext === ".xls" || ext === ".xlsx") return "fa-file-excel text-success";
  return "fa-file";
};
// Xuất toàn bộ helpers dưới dạng object
export default {
  totalindex,
  addindex,
  for: forHelper,
  compare,
  eq,
  truncateFilename,
  endsWith,
  getFileType
};
