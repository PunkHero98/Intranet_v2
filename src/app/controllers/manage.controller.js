import {
  getContentsByUser,
  updateContents,
  updateContentByImageLink,
} from "../models/Contents.model.js";
import { getUsers } from "../models/Users.model.js";
import {
  updateImageinFolder,
  getfileinDir,
} from "../../config/middleware/filsystem.js";
import bcrypt from "bcrypt";
export default new (class ManageController {
  // [GET] /manage
  async manage(req, res) {
    try {
      const username = req.session.username;
      const result = await getContentsByUser(username);
      result.forEach((f) => {
        f.title = Buffer.from(f.title, "base64").toString();
        f.content = JSON.parse(f.content);
        f.content_images = JSON.parse(f.content_images).map((item) => {
          return "\\" + f.images_link + "\\" + item;
        });
      });
      res.render("managePosts", {
        result,
        isManageContent: true,
        role: req.session.userrole,
        username: req.session.username,
        fullname: req.session.fullname,
      });
    } catch (err) {
      res.status(500).json({
        message: "Error fetching profile",
        error: err.message,
      });
    }
  }

  // [POST] /manage/update
  async update(req, res) {
    try {
      let data = req.body;
      const { site, username } = req.session;

      const extractData = data.map((f) => {
        f.title = Buffer.from(f.title).toString("base64");
        f.poster_site = site;
        f.poster = username;
        f.content_images = JSON.stringify(f.content_images);
        return {
          id_content: f.id_content,
          images_link: f.images_link,
          content_images: f.content_images,
        };
      });

      const [updateResult, deleteResult] = await Promise.all([
        updateContents(data),
        updateImageinFolder(extractData),
      ]);

      console.log(updateResult);
      res.send("Update data successfully");
    } catch (err) {
      res
        .status(500)
        .json({ message: "error fetching profile", error: err.message });
    }
  }

  // [POST] /manage/add_news_pics
  async uploadNewPic(req, res) {
    try {
      const { imgFolderName } = req.body;
      const imageArray = await getfileinDir(imgFolderName);
      const Jsonarray = JSON.stringify(imageArray);
      const result = await updateContentByImageLink(imgFolderName, Jsonarray);
      res.send(JSON.stringify(result));
    } catch (err) {
      res
        .status(500)
        .json({ message: "error fetching profile", error: err.message });
    }
  }

  // [GET] /manage/user
  async manageUsers(req, res) {
    try {
      const result = await getUsers();
      const hashBasicPass = await bcrypt.hash("P@55w0rd", 10);
      result.forEach((f) => {
        return (f.user_password = f.user_password === hashBasicPass);
      });
      res.render("manageUsers", {
        result,
        isManageUser: true,
        role: req.session.userrole,
        username: req.session.username,
        fullname: req.session.fullname,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "error fetching user", error: err.message });
    }
  }

  // [POST] /manage/user_updated
  async updateUser(req, res) {
    try {
      console.log(req.body);
      res.send("Success");
    } catch (err) {
      res
        .status(500)
        .json({ message: "error fetching user", error: err.message });
    }
  }
})();
