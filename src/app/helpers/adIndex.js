// Đăng ký helper "uppercase" trong Handlebars

// helpers/sum.js
export const addindex = (a) => {
  return a + 1;
};

export const totalindex = (a) => {
  let i = 0;
  i = a.map((f) => {
    return i++;
  });
  if (i === 0) {
    return 1;
  } else {
    return i;
  }
};

export const forBuildHelper = (from, to, block) => {
  let result = "";
  for (let i = from; i <= to; i++) {
    result += block.fn(i);
  }
  return result;
};
