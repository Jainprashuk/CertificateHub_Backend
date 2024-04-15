const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');



const app = express();
app.use(cors());

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

// MongoDB connection setup
mongoose.connect('mongodb+srv://user:1234@cluster0.oe2xykv.mongodb.net/user', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Mongoose schema and model for file storage
const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer, // Storing file data as binary
  userEmail: String,
});
const FileModel = mongoose.model('File', fileSchema);

// Handle file upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const { userEmail } = req.body; 
  // console.log(userEmail);
  const newFile = new FileModel({
    filename: req.file.originalname,
    contentType: req.file.mimetype,
    data: req.file.buffer, // Save file data as binary buffer
    userEmail: userEmail,
  });

  try {
    // Save file to MongoDB
    await newFile.save();
    res.status(201).send('File uploaded successfully');
    // res.send(alert("hello"))
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Serve files metadata
app.get('/api/files', async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    if (!userEmail) {
      return res.status(400).send('User email is required');
    }
    const files = await FileModel.find({ userEmail: userEmail }, 'filename contentType')
    res.json(files)
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
app.get('/api/files/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await FileModel.findById(fileId);
    if (!file) {
      return res.status(404).send('File not found');
    }
    res.set('Content-Type', file.contentType);
    // res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.send(file.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
// Serve files with metadata
app.get('/api/files/email/:userEmail', async (req, res) => {
  try {
    const {userEmail}=req.params
    const file = await FileModel.find({ userEmail: userEmail }, 'filename contentType')
    if (!file) {
      return res.status(404).send('File not found');
    }
    // res.set('Content-Type', file.contentType);
    // res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.setHeader('Content-Type', 'text/plain');
    // console.log(file[2])
    res.send(file);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
