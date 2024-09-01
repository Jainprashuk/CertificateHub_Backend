const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://user:1234@cluster0.oe2xykv.mongodb.net/user', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;
