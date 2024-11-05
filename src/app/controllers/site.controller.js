import { getUsers } from "../models/Users.model.js";

export default new (class SiteController {
  // [GET] /homepage
  homepage(req, res) {
    res.render("home");
  }

  // [GET] /Teams
  async teams(req, res) {
    try {
      const users = await getUsers();
      res.status(200).json(users);
    } catch (err) {
      res
        .status(500)
        .json({ message: "error fetching users", error: err.message });
    }
  }

  // [GET] /
})();
