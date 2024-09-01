const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer, // Storing file data as binary
  userEmail: String,
});

const FileModel = mongoose.model('File', fileSchema);

module.exports = FileModel;
