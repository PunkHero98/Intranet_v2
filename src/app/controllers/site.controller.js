import { getUsers, getUserById, getUserRole } from "../models/Users.model.js";
import {
  getContents,
  getContentsBySite,
  getContentsByPage,
  getTotalCountOfContent,
  getContentStats,
} from "../models/Contents.model.js";
import path from "path";

function formatDate(date) {
  const dateObj = new Date(date);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const year = dateObj.getFullYear();
  const month = months[dateObj.getMonth()];
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hour = String(dateObj.getHours()).padStart(2, '0');
  const minute = String(dateObj.getMinutes()).padStart(2, '0');

  return `${month}, ${day}, ${year} - ${hour}:${minute}`;
}

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
  
      const updatedContents = await Promise.all(contents.map(async (file) => {
        // Decode title
        file.title = Buffer.from(file.title, "base64").toString();
  
        // Parse content
        try {
          file.content = JSON.parse(file.content);
        } catch (e) {
          file.content = {};
        }
  
        // Parse and format images
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
  
        // 👇 Thêm phần lấy stats
        try {
          const stat = await getContentStats(file.id_content);
          file.contentStat = stat;
        } catch (statErr) {
          console.error("Error getting content stats:", statErr);
          file.contentStat = { views: 0, likes: 0, comments: 0 };
        }
  
        return file;
      }));
  
      const userRole = await getUserRole("HR");
      res.json({
        result: updatedContents,
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
        const site = req.query.site || "Home";
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
        
            if (Array.isArray(file.content_images) && file.content_images.length > 0) {
              file.content_images = path.join(file.images_link, file.content_images[0]);
            } else {
              file.content_images = null;             }
        
            file.date_time = formatDate(file.date_time);
          } catch (err) {
            console.error(`Error parsing content_images for file: ${file.id}`, err);
            file.content_images = null;
          }
        });
        

        contents.sort((a, b) => b.id_content - a.id_content);
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
