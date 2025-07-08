import express from 'express';
import documentController from '../app/controllers/document.controller.js';
import { uploadDocuments } from '../config/middleware/multer.js';
import { convertPDF } from '../config/middleware/convertPDF.js';
import historyRecord from '../config/middleware/historyRecord.js';
import checkAuth from '../config/middleware/checkAuth.js';

const router = express.Router();

router.delete('/delete/document/:id', checkAuth,historyRecord, documentController.deleteDocument);
router.delete('/delete/folder/:id',checkAuth ,historyRecord ,  documentController.deleteFolder);
router.post('/uploadFile',checkAuth ,historyRecord ,  uploadDocuments , documentController.uploadFile);
router.post('/addFolder',checkAuth ,historyRecord ,  documentController.createNewFolder);
router.get('/getall'  , documentController.getAllDocument);
router.get('/site' , checkAuth , documentController.getDocumentBySite);
router.get('/history' , checkAuth , documentController.getDocumentHistory);
router.get('/:id' , convertPDF, documentController.streamDocument);
router.get('/' , documentController.renderDocumentMainPage);

export default router;