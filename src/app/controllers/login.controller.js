import { getUserByEmail } from "../models/Users.model.js";

export default new (class LoginController {
  // [GET] /
  login(req, res) {
    res.render("login");
  }

  async verify(req, res) {
    try {
      const user = await getUserByEmail(`${req.body.emailAddress}`);
      if (user.user_password === req.body.password) {
        return res.redirect("/homepage");
      }
      res.status(301).send("Fail to login");
    } catch (err) {
      res
        .status(500)
        .json({ message: "error fetching users", error: err.message });
    }
  }
})();
