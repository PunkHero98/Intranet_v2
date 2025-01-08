import { getUserById } from "../models/Users.model.js";
export default new (class ProfileController {
  // [GET] /login
  async profile(req, res) {
    try {
      const idUser = req.session.idUser;
      const result = await getUserById(idUser);
      res.render("profile", {
        result,
        isProfile: true,
        role: req.session.userrole,
        username: req.session.username,
        fullname: req.session.fullname,
      });
      console.log(result);
    } catch (err) {
      res
        .status(500)
        .json({ message: "error fetching profile", error: err.message });
    }
  }
})();
