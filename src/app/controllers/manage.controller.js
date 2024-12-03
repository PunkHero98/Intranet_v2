import { getContentsByUser, updateContents } from "../models/Contents.model.js";
import { updateImageinFolder } from "../../config/middleware/filsystem.js";
export default new (class ManageController {
  // [GET] /manage
  async manage(req, res) {
    try {
      const username = req.session.username;
      const result = await getContentsByUser(username);
      result.forEach((f) => {
        f.content_images = JSON.parse(f.content_images).map((item) => {
          return "\\" + f.images_link + "\\" + item;
        });
      });
      res.render("managePosts", {
        result,
        role: req.session.userrole,
        username: req.session.username,
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
})();
