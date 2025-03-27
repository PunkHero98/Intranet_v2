import { getUsers, getUserById, getUserRole } from "../models/Users.model.js";
import {
  getContents,
  getContentsBySite,
  getContentsByPage,
  getTotalCountOfContent
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
        role: userrole,
        isHomePage: true,
        username: username,
        fullname: fullname,
        site: 'Home'
      });
    } catch (err) {
      console.error("Error fetching homepage:", err);
      res.status(500).json({
        message: "Error fetching contents",
        error: err.message,
      });
    }
  }

  //[GET] /homepage/getall
  async getallPage(req, res) {
    try {
      const contents = await getContents();
      contents.forEach((file) => {
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
      const userRole = await getUserRole("HR");
      res.json({
        result: contents,
        userRole,
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
      const { page } = req.params; // Trang hiện tại
      const { title, site, time } = req.query; // Tham số filter
      const limit = 8; // Số bản ghi trên mỗi trang
      const offset = (parseInt(page) - 1) * limit;
  
      // Gọi database để lấy dữ liệu theo filter + phân trang
      const result = await getContentsByPage(offset, limit, title, site, time);
      const totalCount = await getTotalCountOfContent(title, site, time); // Lấy tổng số bản ghi
  
      const totalPages = Math.ceil(totalCount / limit);
  
      // Xử lý dữ liệu (giải mã base64, JSON parse)
      result.forEach((file) => {
        file.title = Buffer.from(file.title, "base64").toString();
        file.content = JSON.parse(file.content);
        if (file.content_images) {
          try {
            file.content_images = JSON.parse(file.content_images);
            if (file.content_images.length > 0) {
              file.content_images = path.join(file.images_link, file.content_images[0]);
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
        currentPage: parseInt(page),
        totalPages,
      });
    } catch (err) {
      res.status(500).json({ message: "Error fetching contents", error: err.message });
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
        const site = req.query.site || "Home"; // Lấy site từ query string
        const siteDetails = {
            Australia: { url: "../imgs/activities/sydney-opera-house-354375.jpg", city: "Sydney City" },
            NewZealand: { url: "../imgs/activities/NZ.jpg", city: "Auckland City" },
            Thailand: { url: "../imgs/activities/bangkok.jpg", city: "Bangkok City" },
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
                file.content_images = path.join(file.images_link, file.content_images[0]);
            } catch (err) {
                console.error(`Error parsing content_images for file: ${file.id}`, err);
                file.content_images = [];
            }
        });

        contents.sort((a, b) => b.id_content - a.id_content);
        console.log("Site được nhận:", site);
        res.render("activity", {
            contents,
            url,
            city,
            site,
            isActiviyPage: true,
            role: req.session.userrole,
            username: req.session.username,
            fullname: req.session.fullname,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching activity", error: err.message });
    }
}

})();
