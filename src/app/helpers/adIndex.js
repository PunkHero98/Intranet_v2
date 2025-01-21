export const totalindex = (value) => {
  return value;
};

export const addindex = (value) => {
  return value + 1;
};

export const forHelper = (from, to, block) => {
  let result = "";
  for (let i = from; i <= to; i++) {
    result += block.fn(i);
  }
  return result;
};

export const compare = function (value1, value2, options) {
  const data = { ...this }; // Clone toàn bộ context hiện tại
  if (value1 === value2) {
    return options.fn(data); // Truyền context đầy đủ vào options.fn
  } else {
    return options.inverse(data);
  }
};

export default {
  totalindex,
  addindex,
  for: forHelper,
  compare,
};
