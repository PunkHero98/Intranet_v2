import loginRouter from "./login.route.js";
import siteRouter from "./site.route.js";
import registerRouter from "./register.route.js";
import contentRouter from "./content.route.js";
import manageRouter from "./manage.route.js";
import profileRouter from "./profile.route.js";
const checkAuth = (req, res, next) => {
  if (!req.session.username) {
    return res.redirect("/login");
  }
  next();
};

function route(app) {
  app.use("/login", loginRouter);
  app.use("/register", registerRouter);
  app.use("/content", checkAuth, contentRouter);
  app.use("/manage", checkAuth, manageRouter);
  app.use("/profile", checkAuth, profileRouter);
  app.use("/reset", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.send("Error destroying session");
      }
      res.redirect("/");
    });
  });
  app.use("/", checkAuth, siteRouter);
}

export default route;
