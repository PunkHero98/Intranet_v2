import { getContentByID, addContent , getContentStats , addContentView , ContentLike} from "../models/Contents.model.js";
import { simPliFizeString, getDate } from "../../config/middleware/assets.js";
import { getfileinDir } from "../../config/middleware/filsystem.js";

function formatDate(dateString) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // dùng định dạng 24h
  };
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', options);
}


export default new (class ContentController {
  // [GET] /content/:slug
  async show(req, res) {
    try {
      const result = await getContentByID(req.params.slug);
      result.title = Buffer.from(result.title, "base64").toString();
      result.content = JSON.parse(result.content);
      if(result.content_file != '[]'){
         result.content_file = JSON.parse(result.content_file).map((file)=>{
          return `/${result.images_link}/${file}`;
        });
        // result.content_file = JSON.parse(result.content_file);
      }
      result.content_images = JSON.parse(result.content_images).map((file) => {
        return `/${result.images_link}/${file}`;
      });
      result.date_time = formatDate(result.date_time);
      if(result.last_updated){
        result.last_updated = formatDate(result.last_updated);
      }
      const userHasLiked = await ContentLike.findOne({
        where: { content_id: parseInt(req.params.slug), user_id: req.session.idUser },
      });
      await addContentView(req.params.slug, req.session.idUser);
      const contentStats = await getContentStats(req.params.slug);
      res.render("contentViews", {
        result,
        contentStats: {...contentStats, userHasLiked: !!userHasLiked},
        isContentView: true,
        role: req.session.userrole,
        username: req.session.username,
        fullname: req.session.fullname,
        total: result.content_images.length,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching content", error: err.message });
    }
  }

  //[POST] /content/like
  async likeContent(req, res) {
    const { contentId } = req.body;
    const userId = req.session?.idUser;
    if (!userId) {
      return res.status(401).json({ success: false, message: "You must be logged in to like." });
    }

    try {
      // Kiểm tra đã like chưa
      const existing = await ContentLike.findOne({
        where: { content_id: contentId, user_id: userId },
      });

      if (existing) {
        return res.status(400).json({ success: false, message: "You already liked this content." });
      }

      // Nếu chưa thì tạo like mới
      await ContentLike.create({
        content_id: contentId,
        user_id: userId,
        liked_at: new Date(),
      });

      res.json({ success: true, message: "Content liked!" });
    } catch (err) {
      console.error("Error liking content:", err);
      res.status(500).json({ success: false, message: "Server error." });
    }
  };
    // [POST] /content/add
    async add(req, res) {
    try {
      const { title, textcontent } = req.body;
      const { username, site } = req.session;
      const folderId = req.folderId;

      if (!req.files || Object.keys(req.files).length === 0) {
        const simpleTitle = Buffer.from(title).toString("base64");
        const imgJsonArray = JSON.stringify([]);
        const docJsonArray = JSON.stringify([]);
        const folderName = null;
        await addContent(
          simpleTitle,
          textcontent,
          folderName,
          imgJsonArray,
          docJsonArray,
          username,
          getDate(),
          site
        );
  
        res.status(200).json({ message: "Files uploaded successfully!" });
        return;
      }

      const newTitle = simPliFizeString(title, true);
      // const simpleTitle = title.replace(/[<>:"/\\|?*]/g, "");
      const simpleTitle = Buffer.from(title).toString("base64");
      const folderName = `Contents/${site}_${username}_${folderId}`;

      const result = await getfileinDir(folderName);
      const imgJsonArray = JSON.stringify(result.images);
      const docJsonArray = JSON.stringify(result.documents);
      await addContent(
        simpleTitle,
        textcontent,
        folderName,
        imgJsonArray,
        docJsonArray,
        username,
        getDate(),
        site
      );

      res.status(200).json({ message: "Files uploaded successfully!" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching activity", error: err.message });
    }
  }

  // [GET] /content/add-news
  getAddpage(req, res) {
    res.render("addContent", {
      isAddNew: true,
      role: req.session.userrole,
      username: req.session.username,
      fullname: req.session.fullname,
    });
  }

  //[POST]//content/download
  download(req ,res) {
    console.log(req.query.file , '---------------------------------------------')
    const filePath = path.join(__dirname, 'IMG_Storage', req.query.file);
    console.log(filePath , '-----------------------------------------------------------')
    res.download(filePath, (err) => {
        if (err) {
            console.error('Lỗi khi tải file:', err);
            res.status(500).send('Không thể tải file');
        }
    });
  }
})();
