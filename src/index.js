import express from "express";
import morgan from "morgan";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "express-handlebars";
import route from "./routes/index.js";
import createError from "http-errors";
import session from "express-session";
import sequelize from "./config/db/sequelize.js";
import sessionStore from "./config/db/sessionstore.js";
import { addindex, totalindex, forBuildHelper } from "./app/helpers/adIndex.js";
import Handlebars from "handlebars";
import dotenv from "dotenv";
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();
// connect to Database
// connectToDB();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// Setup static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("D:\\IMG_Storage"));
app.use(morgan("combined"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

Handlebars.registerHelper("totalindex", totalindex);
Handlebars.registerHelper("addindex", addindex);
Handlebars.registerHelper("for", forBuildHelper);
Handlebars.registerHelper("compare", function (value1, value2, options) {
  if (value1 === value2) {
    return options.fn(this); // Nếu các giá trị bằng nhau, trả về nội dung bên trong {{#compare ...}}.
  } else {
    return options.inverse(this); // Nếu không bằng nhau, trả về nội dung trong {{else}}.
  }
});
// Template Engine
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources\\views"));

// Route INIT
route(app);

// HTTP routing error
app.use((req, res, next) => {
  next(createError.NotFound("This route does not exist."));
});

app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    message: err.message,
  });
});

// SERVER Port INIT
app.listen(process.env.SRV_PORT, () => {
  console.log(
    `This server is running at http://localhost${process.env.SRV_PORT}`
  );
});

sequelize.sync().then(() => {
  console.log("Database synced");
});
