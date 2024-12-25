import { checkUserByEmail } from "../models/Users.model.js";
import bcrypt from "bcrypt";
export default new (class LoginController {
  // [GET] /login
  login(req, res) {
    if (req.session.username) {
      res.redirect("/homepage");
      return;
    }
    res.render("login", {
      isLoginPage: true,
    });
  }
  // [POST] /login
  async verify(req, res) {
    try {
      const { emailAddress, password } = req.body;
      if (!emailAddress || !password) {
        return res.render("login", {
          status: "Email and password are required",
        });
      }
      const user = await checkUserByEmail(emailAddress);
      const isMatch = await bcrypt.compare(password, user.user_password);
      if (isMatch) {
        req.session.username = user.username;
        req.session.userrole = user.user_role;
        req.session.site = user.user_working_site;
        req.session.fullname = user.fullname;
        req.session.idUser = user.id_user;
        return res.redirect("/homepage");
      }
      return res.render("login", {
        isLoginPage: true,
        email: emailAddress,
        status: "Invalid Email or Password",
      });
    } catch (err) {
      console.error("Error during user authentication:", err);
      return res.status(500).json({
        message: "Error fetching users",
        error: err.message,
      });
    }
  }
})();
