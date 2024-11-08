import loginRouter from "./login.route.js";
import siteRouter from "./site.route.js";
import registerRouter from "./register.route.js";
import contentRouter from "./content.route.js";

function route(app) {
  app.use("/login", loginRouter);
  app.use("/register", registerRouter);
  app.use("/content", contentRouter);
  app.use("/", siteRouter);
}

export default route;
