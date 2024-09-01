const FileModel = require('../Models/filemodels.js');
const bucket = require('../Config/firebaseconfig.js');

// Handle file upload
exports.uploadFile = async (req, res) => {
  const { userEmail } = req.body;
  if (!req.file || !userEmail) {
    return res.status(400).send('File and user email are required');
  }

  try {
    const file = req.file;
    const fileUpload = bucket.file(file.originalname);

    await fileUpload.save(file.buffer, {
      metadata: {
        metadata: {
          userEmail: userEmail,
        },
      },
    });

    const newFile = new FileModel({
      filename: file.originalname,
      contentType: file.mimetype,
      userEmail: userEmail,
    });

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

    const fileRef = bucket.file(file.filename);
    const [exists] = await fileRef.exists();
    if (!exists) {
      return res.status(404).send('File not found in Firebase Storage');
    }

    const [fileBuffer] = await fileRef.download();
    res.set('Content-Type', file.contentType);
    res.send(fileBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

// Serve files with metadata by email
exports.getFilesByEmail = async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    if (!userEmail) {
      return res.status(400).send('User email is required');
    }

    const [files] = await bucket.getFiles();
    const userFiles = files.filter(file => file.metadata.metadata.userEmail === userEmail);

    if (userFiles.length === 0) {
      return res.status(404).send('No files found for this user');
    }

    const fileDetails = await Promise.all(userFiles.map(async (file) => {
      const [metadata] = await file.getMetadata();
      const [publicLink] = await file.getSignedUrl({
        action: 'read',
        expires: '03-17-2025',
      });
      return {
        name: file.name,
        link: publicLink,
        metadata: metadata.metadata,
      };
    }));

    res.json(fileDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};
