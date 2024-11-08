import { getUsers } from "../models/Users.model.js";
import { getContents, getContentsBySite } from "../models/Contents.model.js";

export default new (class SiteController {
  // [GET] /homepage
  async homepage(req, res) {
    try {
      const contents = await getContents();
      res.render("home", { contents });
    } catch (err) {
      res
        .status(500)
        .json({ message: "error fetching contents", error: err.message });
    }
  }

  // [GET] /Teams
  async teams(req, res) {
    try {
      const users = await getUsers();
      res.status(200).json(users);
    } catch (err) {
      res
        .status(500)
        .json({ message: "error fetching contents", error: err.message });
    }
  }

  // [POST] /activity
  async activity(req, res) {
    try {
      const { site } = req.body;
      let url = "";
      let city = "";
      const contents = await getContentsBySite(site);
      switch (site) {
        case "Australia":
          url = "../imgs/activities/sydney-opera-house-354375.jpg";
          city = "Sysney City";
          break;
        case "New Zealand":
          url = "../imgs/activities/NZ.jpg";
          city = "Auckland City";
          break;
        case "Thailand":
          url = "../imgs/activities/bangkok.jpg";
          city = "Bangkok City";
          break;
        case "Vietnam":
          url = "../imgs/activities/VN.jpg";
          city = "Ho Chi Minh City";
          break;
        case "Philippines":
          url = "../imgs/activities/PH.jpg";
          city = "Manila City";
          break;
      }
      res.render("activity", { contents, url, city, site });
    } catch (err) {
      res
        .status(500)
        .json({ message: "error fetching activity", error: err.message });
    }
  }
})();
