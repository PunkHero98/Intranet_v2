import express from 'express';
import documentController from '../app/controllers/document.controller.js';
import { uploadDocuments } from '../config/middleware/multer.js';
import { convertPDF } from '../config/middleware/convertPDF.js';
import historyRecord from '../config/middleware/historyRecord.js';
const router = express.Router();

router.delete('/delete/document/:id',historyRecord, documentController.deleteDocument);
router.delete('/delete/folder/:id' ,historyRecord ,  documentController.deleteFolder);
router.post('/uploadFile',historyRecord ,  uploadDocuments , documentController.uploadFile);
router.post('/addFolder',historyRecord ,  documentController.createNewFolder);
router.get('/getall' , documentController.getAllDocument);
router.get('/site' , documentController.getDocumentBySite);
router.get('/history' , documentController.getDocumentHistory);
router.get('/:id' ,  convertPDF, documentController.streamDocument);
router.get('/',  documentController.renderDocumentMainPage);

export default router;