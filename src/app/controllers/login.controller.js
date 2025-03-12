import {
  checkUserByEmailSequelize,
  updateUserSession,
} from "../models/Users.model.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

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
            return res.json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await checkUserByEmailSequelize(emailAddress);
        if (!user) {
            return res.json({
                success: false,
                message: "Email not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.user_password);
        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid Email or Password",
            });
        }

        if (!user.isActived) {
            return res.json({
                success: false,
                message: "Account is not active, please contact admin",
            });
        }

        const newSessionId = uuidv4();

        // Cập nhật session_id mới vào database (ghi đè session cũ)
        await updateUserSession(user.id_user, newSessionId);

        // Lưu session mới vào req.session
        req.session.username = user.username;
        req.session.userrole = user.user_role;
        req.session.site = user.user_working_site;
        req.session.fullname = user.fullname;
        req.session.idUser = user.id_user;
        req.session.sessionId = newSessionId;

        return res.redirect("/homepage");
    } catch (err) {
        console.error("Error during user authentication:", err);
        return res.status(500).json({
            message: "Error fetching users",
            error: err.message,
        });
    }
}
})();
