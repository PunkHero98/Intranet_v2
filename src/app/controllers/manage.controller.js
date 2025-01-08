import {
  getContentsByUser,
  updateContents,
  updateContentByImageLink,
} from "../models/Contents.model.js";
import {
  getUsers,
  updateUser,
  updateUserWithPass,
} from "../models/Users.model.js";
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
      await Promise.all(
        result.map(async (f) => {
          f.user_password = await bcrypt.compare("P@55w0rd", f.user_password);
        })
      );
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
      const { userrole } = req.session;
      if (userrole !== "Admin") {
        res.json({
          success: false,
          message: "You are not authorized to update user",
        });
        return;
      }
      const {
        email,
        user_role,
        user_working_site,
        is_reset_password,
        isActivated,
      } = req.body;
      const hashBasicPass = await bcrypt.hash("P@55w0rd", 10);
      console.log(hashBasicPass);
      let result = "";
      if (is_reset_password) {
        result = await updateUserWithPass(
          email,
          user_role,
          user_working_site,
          isActivated,
          hashBasicPass
        );
      } else {
        result = await updateUser(
          email,
          user_role,
          user_working_site,
          isActivated
        );
      }

      if (result[0] === 1) {
        res.json({ success: true, message: "Update user successfully" });
        return;
      } else {
        res.json({ success: false, message: "Update user fail" });
        return;
      }
    } catch (err) {
      res
        .status(500)
        .json({ message: "error fetching user", error: err.message });
    }
  }
})();
