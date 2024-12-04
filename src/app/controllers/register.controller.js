export default new (class RegisterController {
  // [GET] /register
  register(req, res) {
    try {
      res.render("register");
    } catch (err) {
      res
        .status(500)
        .json({ message: "error fetching users", error: err.message });
    }
  }

  // [POST] /register/tfa
  async tfa(req, res) {
    try {
      console.log(req.body);
      res.send("request successfully!");
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
})();
