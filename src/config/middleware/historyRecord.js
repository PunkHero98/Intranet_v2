import { logUserAction } from "../../app/services/historyLogger.service.js";
import User from "../../app/models/Users.model.js";
const logHistoryMiddleware = async (req, res, next) => {
    res.on("finish", async () => {
    const log = res.locals.log;

    // Chỉ log nếu controller gán res.locals.log
    if (!log) return;

    const {
      action,
      userId,
      documentName = null,
      folderName = null,
      description = null,
      extra = {}
    } = log;

    let finalDescription = description;
    const userName = userId ? (await User.findByPk(userId)).username : 'unknown';
    if (!finalDescription) {
      const userLabel = `User ${userName}`;
      if (documentName) {
        finalDescription = `${userLabel} ${action.toLowerCase().replace(/_/g, ' ')} "${documentName}"`;
      } else if (folderName) {
        finalDescription = `${userLabel} ${action.toLowerCase().replace(/_/g, ' ')} "${folderName}"`;
      } else {
        finalDescription = `${userLabel} performed action "${action}"`;
      }
    }

    try {
      await logUserAction({
        action,
        userId,
        documentName,
        folderName,
        description: finalDescription,
        extra: {
          ...extra,
          method: req.method,
          ip: req.ip,
          path: req.originalUrl,
          statusCode: res.statusCode
        }
      });
    } catch (err) {
      console.error("Failed to log user action:", err.message);
    }
  });

  next();
};

export default logHistoryMiddleware;