import { Folder } from "../models/Documents.model.js";

export const getAllChildFolders = async (parentIds) => {
  let all = [];
  const queue = [...parentIds];

  while (queue.length > 0) {
    const currentId = queue.shift();
    const children = await Folder.findAll({ where: { parentId: currentId } });
    const childIds = children.map(c => c.id);
    queue.push(...childIds);
    all.push(...children);
  }

  return all;
};