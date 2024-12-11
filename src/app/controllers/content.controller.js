import { getContentByID, addContent } from "../models/Contents.model.js";
import { simPliFizeString, getDate } from "../../config/middleware/assets.js";
import { getfileinDir } from "../../config/middleware/filsystem.js";

export default new (class ContentController {
  // [GET] /content/:slug
  async show(req, res) {
    try {
      const result = await getContentByID(req.params.slug);
      result.content = JSON.parse(result.content);
      result.content_images = JSON.parse(result.content_images).map((file) => {
        return `\\${result.images_link}\\${file}`;
      });

      console.log(result);
      res.render("contentViews", {
        result,
        role: req.session.userrole,
        username: req.session.username,
        total: result.content_images.length,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching content", error: err.message });
    }
  }

  // [POST] /content/add
  async add(req, res) {
    try {
      const { title, textcontent } = req.body;
      const { username, site } = req.session;

      if (!req.files) {
        return res.status(400).json({ message: "No files were uploaded." });
      }

      const newTitle = simPliFizeString(title, true);
      const simpleTitle = title.replace(/[<>:"/\\|?*]/g, "");
      const folderName = `${site}_${username}_${newTitle}`;
      const imgArray = await getfileinDir(folderName);
      const imgJsonArray = JSON.stringify(imgArray);
      await addContent(
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
        .json({ message: "Error fetching activity", error: err.message });
    }
  }

  // [GET] /content/add-news
  getAddpage(req, res) {
    res.render("addContent", {
      role: req.session.userrole,
      username: req.session.username,
      fullname: req.session.fullname,
    });
  }
})();
