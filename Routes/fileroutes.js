const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const fileController = require('../Controllers/filecontrollers.js');

const router = express.Router();

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/files', fileController.getFiles);
router.get('/files/:id', fileController.getFileById);
router.get('/files/email/:userEmail', fileController.getFilesByEmail);

module.exports = router;
