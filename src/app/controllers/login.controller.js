import { getUserByEmail } from "../models/Users.model.js";

export default new (class LoginController {
  // [GET] /login
  login(req, res) {
    if (req.session.username) {
      res.redirect("/homepage");
      return;
    }
    res.render("login");
  }
  // [POST] /login
  async verify(req, res) {
    try {
      const { emailAddress, password } = req.body;
      const user = await getUserByEmail(emailAddress, password);
      if (user) {
        req.session.username = user.username;
        req.session.userrole = user.user_role;
        req.session.site = user.user_working_site;
        req.session.fullname = user.fullname;
        req.session.idUser = user.id_user;
        return res.redirect("/homepage");
      }
      res.status(401).send("Fail to login");
    } catch (err) {
      res
        .status(500)
        .json({ message: "error fetching users", error: err.message });
    }
  }
})();
