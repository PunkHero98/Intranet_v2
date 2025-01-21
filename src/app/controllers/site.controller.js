import { getUsers, getUserById } from "../models/Users.model.js";
import {
  getContents,
  getContentsBySite,
  getContentsByPage,
} from "../models/Contents.model.js";
import path from "path";
export default new (class SiteController {
  // [GET] /
  redirecT(req, res) {
    res.redirect("/login");
  }
  // [GET] /homepage
  async homepage(req, res) {
    try {
      const { userrole, username, fullname } = req.session;

      const contents = await getContents();
      if (!contents || !Array.isArray(contents)) {
        throw new Error("Invalid content data");
      }
      res.render("home", {
        numOfPages: Math.ceil(contents.length / 8),
        role: userrole,
        isHomePage: true,
        username: username,
        fullname: fullname,
      });
    } catch (err) {
      console.error("Error fetching homepage:", err);
      res.status(500).json({
        message: "Error fetching contents",
        error: err.message,
      });
    }
  }

  // [GET] /homepage/:page
  async navigatePages(req, res) {
    try {
      const { page } = req.params; // Số trang hiện tại
      const limit = 8; // Số bản ghi trên mỗi trang
      const offset = page * limit;

      const result = await getContentsByPage(offset, limit);
      const totalCount = await getContents();
      const totalPages = Math.ceil(totalCount.length / limit);
      result.forEach((file) => {
        file.title = Buffer.from(file.title, "base64").toString();
        file.content = JSON.parse(file.content);
        if (file.content_images) {
          try {
            file.content_images = JSON.parse(file.content_images);
            if (file.content_images.length > 0) {
              file.content_images = path.join(
                file.images_link,
                file.content_images[0]
              );
            }
          } catch (parseError) {
            console.error("Error parsing content_images:", parseError);
            file.content_images = [];
          }
        }
      });
      // Trả về dữ liệu
      res.json({
        result,
        currentPage: parseInt(page) + 1,
        totalPages,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching contents", error: err.message });
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
      const siteDetails = {
        Australia: {
          url: "../imgs/activities/sydney-opera-house-354375.jpg",
          city: "Sydney City",
        },
        NewZealand: {
          url: "../imgs/activities/NZ.jpg",
          city: "Auckland City",
        },
        Thailand: {
          url: "../imgs/activities/bangkok.jpg",
          city: "Bangkok City",
        },
        Vietnam: { url: "../imgs/activities/VN.jpg", city: "Ho Chi Minh City" },
        Philippines: { url: "../imgs/activities/PH.jpg", city: "Manila City" },
      };

      const { url, city } = siteDetails[site] || {};

      if (!url || !city) {
        return res.status(400).json({ message: "Invalid site" });
      }
      const contents = await getContentsBySite(site);
      contents.forEach((file) => {
        try {
          file.title = Buffer.from(file.title, "base64").toString();
          file.content = JSON.parse(file.content);
          file.content_images = JSON.parse(file.content_images);
          file.content_images = path.join(
            file.images_link,
            file.content_images[0]
          );
        } catch (err) {
          console.error(
            `Error parsing content_images for file: ${file.id}`,
            err
          );
          file.content_images = [];
        }
      });
      contents.sort((a, b) => b.id_content - a.id_content);
      res.render("activity", {
        contents,
        url,
        city,
        site,
        role: req.session.userrole,
        username: req.session.username,
        fullname: req.session.fullname,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching activity", error: err.message });
    }
  }
})();
