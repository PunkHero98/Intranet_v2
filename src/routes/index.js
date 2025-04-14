import loginRouter from "./login.route.js";
import siteRouter from "./site.route.js";
import registerRouter from "./register.route.js";
import contentRouter from "./content.route.js";
import manageRouter from "./manage.route.js";
import profileRouter from "./profile.route.js";
import feedBackRouter from "./feedBack.route.js";
import commentRouter from "./comment.route.js";
import { getUserById , updateUserSession } from "../app/models/Users.model.js";
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



function route(app) {
  app.use("/login", loginRouter);
  app.use('/comment',checkAuth , commentRouter);
  app.use("/feedback" ,checkAuth, feedBackRouter);
  app.use("/register", registerRouter);
  app.use("/content", checkAuth, contentRouter);
  app.use("/manage", checkAuth, manageRouter);
  app.use("/profile", checkAuth, profileRouter);
  app.use('/logout' ,async (req, res) =>{
    if (!req.session.idUser) {
      return res.json({
        success: false,
        message: "Have not login yet",
      });
    }

    // Xóa session trong database
    await updateUserSession(req.session.idUser, null);

    // Hủy session trên server
    req.session.destroy(() => {
      res.redirect("/login");
    });
  });
  app.use("/", checkAuth, siteRouter);
}

export default route;
