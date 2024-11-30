import { getContentsByUser } from "../models/Contents.model.js";
export default new (class ManageController {
  // [GET] /manage
  async manage(req, res) {
    try {
      const username = req.session.username;
      const result = await getContentsByUser(username);
      result.map((f) => {
        f.content_images = JSON.parse(f.content_images);
        f.content_images = f.content_images.map((item) => {
          return (item = "\\" + f.images_link + "\\" + item);
        });
      });
      res.render("managePosts", {
        result,
        role: req.session.userrole,
        username: req.session.username,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "error fetching profile", error: err.message });
    }
  }

  async update(req, res) {
    try {
      const data = req.body;
      console.log(data);
      res.send("Update data successfully");
    } catch (err) {}
  }
})();
