import { getUserById } from "../../app/models/Users.model.js";

async function checkAuth(req, res, next) {
  if (!req.session.idUser) {
      return res.redirect("/login"); // Chuyển hướng nếu chưa đăng nhập
  }

  const user = await getUserById(req.session.idUser);
  if (!user || user.session_id !== req.session.sessionId) {
      req.session.destroy(() => {
          res.redirect("/login");
      });
  } else {
      next();
  }
}

export default checkAuth;
