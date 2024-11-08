export default new (class RegisterController {
  register(req, res) {
    try {
      res.render("register");
    } catch (err) {
      res
        .status(500)
        .json({ message: "error fetching users", error: err.message });
    }
  }

  async tfa(req, res) {}
})();
