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

  return `${month} ${day}, ${year} - ${hour}:${minute}`;
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
      if( username === undefined || fullname === undefined) {
          return res.render("home", {
          // role: userrole,
          isHomePage: true,
          // username: username,
          // fullname: fullname,
          site: 'Home'
        });
      }
      return res.render("home", {
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
          file.contentStat = await getContentStats(file.id_content);
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
      const { page } = req.params; 
      const { poster, site, order } = req.query; 
      let time = req.query.time === "null" ? null : req.query.time;
      const limit = 8; 
      const offset = page == 1 ? 0 : (page - 1) * limit;

      const contents = await getContentsByPage(offset, poster, site, time, order);
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
        try {
          file.contentStat = await getContentStats(file.id_content);
        } catch (statErr) {
          console.error("Error getting content stats:", statErr);
          file.contentStat = { views: 0, likes: 0, comments: 0 };
        }
        
        return file;
      }));
      res.json({
        message: "Successfully fetched contents",
        contents: updatedContents,
      });
    } catch (err) {
      res.status(500).json({ message: "Error fetching contents", error: err.message });
    }
  }

  // [GET] /homepage/total
  async getTotalCount(req, res) {
    try {
      const userRole = await getUserRole("HR");
      if (!userRole) {
        return res.status(404).json({ message: "User role not found" });
      }
      const totalCount = await getTotalCountOfContent();
      const totalPages = Math.ceil(totalCount / 8); // Assuming 8 items per page
      res.json({ total: totalPages, userRole });
    } catch (err) {
      console.error("Error fetching total count:", err);
      res.status(500).json({ message: "Error fetching total count", error: err.message });
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

        let contents = await getContentsBySite(site);

        const updateContent = await Promise.all(
            contents
                .filter((file) => {
                    // Chỉ giữ lại những file chưa bị xóa
                    return !file.deleted;
                })
                .map(async (file) => {
                    try {
                        file.title = Buffer.from(file.title, "base64").toString();
                        file.content = JSON.parse(file.content);
                        file.content_images = JSON.parse(file.content_images);

                        // Gán ảnh đầu tiên nếu có
                        if (Array.isArray(file.content_images) && file.content_images.length > 0) {
                            file.content_images = path.join(file.images_link, file.content_images[0]);
                        } else {
                            file.content_images = null;
                        }
                        
                        file.originalDate = file.date_time; // Lưu ngày gốc để sử dụng sau
                        file.date_time = formatDate(file.date_time);

                        // Thống kê
                        try {
                            file.contentStat = await getContentStats(file.id_content);
                        } catch (statErr) {
                            console.error("Error getting content stats:", statErr);
                            file.contentStat = { total_views: 0, total_likes: 0, total_comments: 0 };
                        }

                        return file;
                    } catch (err) {
                        console.error(`Error processing file: ${file.id_content}`, err);
                        return null; // Bỏ qua file lỗi
                    }
                })
        );

        // Loại bỏ những file bị lỗi khi xử lý (null)
        const filteredContents = updateContent.filter((file) => file !== null);

        // Sắp xếp
        filteredContents.sort((a, b) => b.id_content - a.id_content);

        res.render("activity", {
            contents: filteredContents,
            url,
            city,
            site,
            isActiviyPage: true,
            role: req.session.userrole,
            username: req.session.username,
            fullname: req.session.fullname,
        });

    } catch (err) {
        console.error("Error in activity route:", err);
        res.status(500).json({ message: "Error fetching activity", error: err.message });
    }
}


})();
