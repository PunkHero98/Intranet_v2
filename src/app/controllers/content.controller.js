import { getContentByID } from "../models/Contents.model.js";
import path from "path";
import fs from "fs";
import { getfileinDir } from "../../config/middleware/filsystem.js";

export default new (class ContentController {
  // [GET] /content/:slug
  async show(req, res) {
    const result = await getContentByID(req.params.slug);
    res.send(result);
  }

  // [POST] /content/add
  async add(req, res) {
    const { title, textcontent } = req.body;
    const { username, site } = req.session;
    if (!req.files) {
      return res.status(400).json({ message: "No files were uploaded." });
    }
    // const imagePaths = req.files.map(
    //   (file) => `D:\\IMG_Storage\\${file.filename}`
    // );

    const array = getfileinDir(site + "_" + username + "_" + title);

    res.status(200).json({
      message: "Files uploaded successfully!",
      imagePaths: array,
    });
    console.log(title + "     " + textcontent);
  }

  // [GET] /content/
  getAddpage(req, res) {
    res.render("addContent");
  }
})();
