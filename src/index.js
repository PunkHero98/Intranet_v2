import express from "express";
import morgan from "morgan";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import handlebarsNew from "express-handlebars";
import route from "./routes/index.js";
import createError from "http-errors";
import session from "express-session";
import sequelize from "./config/db/sequelize.js";
import sessionStore from "./config/db/sessionstore.js";
import helpers from "./app/helpers/adIndex.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Connect to Database
sequelize.sync().then(() => {
  console.log("Database synced");
});

// Middleware
app.use(
  session({
    secret: "low-row-rate",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("D:\\IMG_Storage")); // Static folder for Img update
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Template Engine
app.engine(
  "hbs",
  handlebarsNew.engine({
    extname: ".hbs",
    helpers,
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

// Route INIT
route(app);

// HTTP Routing Errors
app.use((req, res, next) => {
  next(createError.NotFound("This route does not exist."));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message,
  });
});

// Server Port INIT
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
