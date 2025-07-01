import { History } from "../models/History.model.js";

export const logUserAction = async ({
  userId,
  action,
  documentName = null,
  folderName = null,
  description = null,
  extra = {}
}) => {
  try {
    await History.create({
      userId,
      action,
      documentName,
      folderName,
      description,
      extraInfo: JSON.stringify(extra),
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Error while logging history:", err.message);
  }
};
