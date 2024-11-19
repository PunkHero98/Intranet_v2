import { getContentByID, addContent } from "../models/Contents.model.js";
import path from "path";

import { simPliFizeString, getDate } from "../../config/middleware/assets.js";
import { getfileinDir } from "../../config/middleware/filsystem.js";

export default new (class ContentController {
  // [GET] /content/:slug
  async show(req, res) {
    const result = await getContentByID(req.params.slug);

    res.render("contentViews", {
      role: req.session.userrole,
      username: req.session.username,
    });
  }

  // [POST] /content/add
  async add(req, res) {
    const { title, textcontent } = req.body;
    const { username, site } = req.session;
    if (!req.files) {
      return res.status(400).json({ message: "No files were uploaded." });
    }
    const newTitle = simPliFizeString(title, true);
    const simpleTitle = title.replace(/[<>:"/\\|?*]/g, "");
    const folderName = site + "_" + username + "_" + newTitle;
    const imgArray = await getfileinDir(folderName);
    const imgJsonArray = JSON.stringify(imgArray);
    try {
      const result = await addContent(
        simpleTitle,
        textcontent,
        folderName,
        imgJsonArray,
        username,
        getDate(),
        site
      );
      res.status(200).json({ message: "Files uploaded successfully!" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "error fetching activity", error: err.message });
    }
  }

  // [GET] /content/
  getAddpage(req, res) {
    res.render("addContent");
  }
})();
