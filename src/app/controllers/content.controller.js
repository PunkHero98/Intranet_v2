import { getContentByID, addContent } from "../models/Contents.model.js";
import { simPliFizeString, getDate } from "../../config/middleware/assets.js";
import { getfileinDir } from "../../config/middleware/filsystem.js";

export default new (class ContentController {
  // [GET] /content/:slug
  async show(req, res) {
    try {
      const result = await getContentByID(req.params.slug);
      result.title = Buffer.from(result.title, "base64").toString();
      result.content = JSON.parse(result.content);
      if(result.content_file){
        //  result.content_file = JSON.parse(result.content_file).map((file)=>{
        //   return `/${result.images_link}/${file}`;
        // });
        result.content_file = JSON.parse(result.content_file);
      }
      result.content_images = JSON.parse(result.content_images).map((file) => {
        return `/${result.images_link}/${file}`;
      });
      res.render("contentViews", {
        result,
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

  // [POST] /content/add
  async add(req, res) {
    try {
      const { title, textcontent } = req.body;
      const { username, site } = req.session;

      if (!req.files) {
        return res.status(400).json({ message: "No files were uploaded." });
      }

      const newTitle = simPliFizeString(title, true);
      // const simpleTitle = title.replace(/[<>:"/\\|?*]/g, "");
      const simpleTitle = Buffer.from(title).toString("base64");
      const folderName = `Contents/${site}_${username}_${newTitle}`;

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
