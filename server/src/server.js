const express = require('express');
require('dotenv').config();
const dbConnect = require('./config/database');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// ----- All the Routes -----
app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/', userRoutes);
app.use('/', requestRoutes);

// Database Connection
(async () => {
  try {
    await dbConnect();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Server startup failed');
    process.exit(1);
  }
})();
