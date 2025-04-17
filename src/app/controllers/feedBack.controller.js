import { getfileinDir } from "../../config/middleware/filsystem.js";
import { addFeedBack, getAllFeedBack } from "../models/FeedBacks.model.js";
import { v4 as uuidv4 } from "uuid";

export default new (class FeedBackController {

    //[POST] feedback/
    async getFeedBack(req , res){
        try {
            const { username , site } = req.session;
            const {fb_category , fb_message } = req.body;
            const uniqueId = req.feedbackId;
            
            if(!req.files || Object.keys(req.files).length === 0) {
                const simpleMessage = Buffer.from(fb_message).toString('base64');
                const folderName = null;
                const imgJsonArray = JSON.stringify([]);
                await addFeedBack({
                    username,
                    user_site: site,
                    category: fb_category,
                    message: simpleMessage,
                    images_link: folderName,
                    feedback_images: imgJsonArray,
                    is_clear: false,
                });
                res.status(200).json({ message: "Feedback uploaded successfully!" });
                return;
            }
            const simpleMessage = Buffer.from(fb_message).toString('base64');
            const folderName = `Feedbacks/${username}_${uniqueId}`;
            
            const result = await getfileinDir(folderName);

            const imgJsonArray = JSON.stringify(result.images);
            const respone = await addFeedBack({
                username,
                user_site: site,
                category: fb_category,
                message: simpleMessage,
                images_link: folderName,
                feedback_images: imgJsonArray,
                is_clear: false,
            });
            res.status(200).json({ message: "Feedback uploaded successfully!" });
        } catch (err) {
            res.status(500).json({ message: "Error fetching feedback page", error: err.message });
        }
    }

    //[GET] feedback/getall
    async getAllFeedBack(req , res){
        try {
            const result = await getAllFeedBack();
            if (!result) {
                return res.status(404).json({ message: "No feedback found" });
            }
            result.forEach((f) => {
                f.message = Buffer.from(f.message, "base64").toString();
                f.feedback_images = JSON.parse(f.feedback_images).map((item) => {
                    return "\\" + f.images_link + "\\" + item;
                });
            });
            res.status(200).json({result ,  message: "Feedback uploaded successfully!" });
        } catch (err) {
            res.status(500).json({ message: "Error fetching feedback page", error: err.message });
        }
    }
})