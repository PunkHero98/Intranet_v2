import express from "express";
import morgan from "morgan";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "express-handlebars";
import route from "./routes/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// connect to Database
// connectToDB();

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

// SERVER Port INIT
app.listen(port, () => {
  console.log(`This server is running at http://localhost${port}`);
});
