import { getUserByEmail } from "../models/Users.model.js";

export default new (class LoginController {
  // [GET] /
  login(req, res) {
    res.render("login");
  }
  // [POST] /login/verify
  async verify(req, res) {
    try {
      const { emailAddress, password } = req.body;
      const user = await getUserByEmail(`${emailAddress}`);
      if (user.user_password === password) {
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
