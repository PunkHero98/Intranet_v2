import { checkUserByEmail, createUser } from "../models/Users.model.js";
import bcrypt from "bcrypt";
export default new (class RegisterController {
  // [GET] /register
  register(req, res) {
    try {
      res.render("register", {
        isRegister: true,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "error fetching users", error: err.message });
    }
  }

  // [POST] /register/tfa
  async tfa(req, res) {
    try {
      const {
        fullname,
        email,
        user_password,
        user_role,
        department,
        position,
        user_working_site,
        user_address,
        office_phone_number,
      } = req.body;
      const hashedPassword = await bcrypt.hash(user_password, 10);

      const result = await createUser(
        fullname,
        email,
        hashedPassword,
        user_role,
        department,
        position,
        user_working_site,
        user_address,
        office_phone_number
      );
      if (result.length !== 0) {
        res.json({ success: true, message: "Register successfully !" });
        return;
      } else {
        res.json({ success: false, message: "Register fail !" });
        return;
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  // [POST] /register/check-email
  async checkEmail(req, res) {
    try {
      const { email } = req.body;
      const result = await checkUserByEmail(email);
      if (result) {
        res.json({ success: true, message: "Email is already taken" });
        return;
      }
      res.json({ success: false, message: "Email is available" });
      console.log(result);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
})();
