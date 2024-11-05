import loginRouter from "./login.route.js";
import siteRouter from "./site.route.js";

function route(app) {
  app.use("/login", loginRouter);
  app.use("/", siteRouter);
}

export default route;
