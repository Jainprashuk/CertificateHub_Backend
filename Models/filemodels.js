const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  userEmail: String,
});

module.exports = mongoose.model('File', fileSchema);
