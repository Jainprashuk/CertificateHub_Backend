const FileModel = require('../Models/filemodels.js');

// Handle file upload
exports.uploadFile = async (req, res) => {
  const { userEmail } = req.body; 

  const newFile = new FileModel({
    filename: req.file.originalname,
    contentType: req.file.mimetype,
    data: req.file.buffer, // Save file data as binary buffer
    userEmail: userEmail,
  });

  try {
    await newFile.save();
    res.status(201).send('File uploaded successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

// Serve files metadata
exports.getFiles = async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    if (!userEmail) {
      return res.status(400).send('User email is required');
    }
    const files = await FileModel.find({ userEmail: userEmail }, 'filename contentType');
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

// Serve a specific file by ID
exports.getFileById = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await FileModel.findById(fileId);
    if (!file) {
      return res.status(404).send('File not found');
    }
    res.set('Content-Type', file.contentType);
    res.send(file.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

// Serve files with metadata by email
exports.getFilesByEmail = async (req, res) => {
  try {
    const { userEmail } = req.params;
    const files = await FileModel.find({ userEmail: userEmail }, 'filename contentType');
    if (!files || files.length === 0) {
      return res.status(404).send('Files not found');
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(files);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};
