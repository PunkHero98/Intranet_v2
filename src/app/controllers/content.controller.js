import { getContentByID } from "../models/Contents.model.js";
export default new (class ContentController {
  // [GET] /content/:slug
  async show(req, res) {
    const result = await getContentByID(req.params.slug);
    res.send(result);
  }

  // [POST] /content/add
  async add(req, res) {
    const { title, text_content } = req.body;
    if (!req.files) {
      return res.status(400).json({ message: "No files were uploaded." });
    }
    const imagePaths = req.files.map(
      (file) => `D:\\IMG_Storage\\${file.filename}`
    );
    res.status(200).json({
      message: "Files uploaded successfully!",
      imagePaths: imagePaths,
    });
    console.log(title + "     " + text_content);
  }
})();
