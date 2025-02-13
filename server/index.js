const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/auth');

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', protect, userRoutes);
app.use('/users', protect, messageRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
