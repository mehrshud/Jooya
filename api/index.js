// backend/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const connectDB = require('./config/db');
const { analyzeSentiment } = require('./services/aiService');


// --- Initialization ---
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Create HTTP server for WebSocket

// --- CORS & WebSocket Configuration ---
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
};

const io = new Server(server, { cors: corsOptions });

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Pass `io` instance to all requests so services can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// --- Core Middleware ---
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', apiLimiter);

// --- API Routes ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes')); // New
app.use('/api/users', require('./routes/userRoutes')); // New

// --- Error Handling ---
app.use(notFoundHandler);
app.use(errorHandler);

// --- Server Startup ---
const PORT = process.env.PORT || 3001;
// Listen on the http server, not just the Express app
server.listen(PORT, () => {
  console.log(`Server with WebSocket running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;