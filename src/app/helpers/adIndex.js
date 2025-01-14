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

export const compare = (value1, value2, options) => {
  if (value1 === value2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

export default {
  totalindex,
  addindex,
  for: forHelper,
  compare,
};
