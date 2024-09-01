const express = require('express');
const cors = require('cors');
const fileRoutes = require('./Routes/fileroutes.js');
const db = require('./Config/database.js')

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use('/api', fileRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
