import loginRouter from "./login.route.js";
import siteRouter from "./site.route.js";
import registerRouter from "./register.route.js";
import contentRouter from "./content.route.js";

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
  app.use("/reset", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.send("Error destroying session");
      }
      res.send("Session reset successfully");
    });
  });
  app.use("/", checkAuth, siteRouter);
}

export default route;
