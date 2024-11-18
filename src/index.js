import express from "express";
import morgan from "morgan";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import handlebars, { create } from "express-handlebars";
import route from "./routes/index.js";
import createError from "http-errors";
import session from "express-session";
import sequelize from "./config/db/sequelize.js";
import sessionStore from "./config/db/sessionstore.js";
import { getUserByEmail } from "./app/models/Users.model.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// connect to Database
// connectToDB();

app.use(
  session({
    secret: "your-secret-key", // Khóa bí mật để mã hóa session
    resave: false, // Không lưu lại session nếu không có thay đổi
    saveUninitialized: false, // Không tạo session nếu không có dữ liệu
    store: sessionStore, // Sử dụng SequelizeStore để lưu trữ session vào SQL Server
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // Thời gian sống của cookie (7 ngày)
    },
  })
);

// Setup static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("combined"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
app.listen(port, () => {
  console.log(`This server is running at http://localhost${port}`);
});

sequelize.sync().then(() => {
  console.log("Database synced");
});
