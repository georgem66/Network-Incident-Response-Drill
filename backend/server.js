const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const scenarioRoutes = require('./routes/scenarios');
const incidentRoutes = require('./routes/incidents');
const toolRoutes = require('./routes/tools');
const scoreRoutes = require('./routes/scores');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const sequelize = require('./config/database');
const mongoose = require('./config/mongodb');
const socketHandler = require('./sockets/socketHandler');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 3001;
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/scenarios', authMiddleware, scenarioRoutes);
app.use('/api/incidents', authMiddleware, incidentRoutes);
app.use('/api/tools', authMiddleware, toolRoutes);
app.use('/api/scores', authMiddleware, scoreRoutes);
if (process.env.NODE_ENV !== 'production') {
  const swaggerJsdoc = require('swagger-jsdoc');
  const swaggerUi = require('swagger-ui-express');
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Network Incident Response Drill API',
        version: '1.0.0',
        description: 'API for the Network Incident Response Drill Platform',
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: 'Development server',
        },
      ],
    },
    apis: ['./routes/*.js'],
  };
  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
socketHandler(io);
app.use(errorHandler);
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection established successfully.');
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');
    await mongoose.connection;
    console.log('MongoDB connection established successfully.');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
      }
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    sequelize.close();
    mongoose.connection.close();
    process.exit(0);
  });
});
startServer();
module.exports = app;