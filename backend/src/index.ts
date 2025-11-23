import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import { config, validateConfig } from '@/config/config';
import connectDB from '@/config/database';
import { redisClient } from '@/config/redis';
import { logger, morganStream } from '@/utils/logger';
import { errorHandler, notFoundHandler } from '@/utils/errors';

// Routes (will be created next)
// import authRoutes from '@/routes/auth';
// import productRoutes from '@/routes/products';
// import categoryRoutes from '@/routes/categories';
// import cartRoutes from '@/routes/cart';
// import orderRoutes from '@/routes/orders';
// import userRoutes from '@/routes/users';
// import adminRoutes from '@/routes/admin';

const app = express();

// Validate configuration
validateConfig();

// Connect to databases
connectDB();
redisClient.connect().catch((error) => {
  logger.warn('Redis connection failed:', error);
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "res.cloudinary.com"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.stripe.com"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || config.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// Security and sanitization
app.use(mongoSanitize());
app.use(hpp());

// Rate limiting
if (!config.skipRateLimiting) {
  const limiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);
}

// Logging
app.use(morgan('combined', { stream: morganStream }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'E-Commerce API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API routes
app.use(`/api/${config.apiVersion}`, (req, res, next) => {
  // Add API version to response headers
  res.setHeader('X-API-Version', config.apiVersion);
  next();
});

// app.use(`/api/${config.apiVersion}/auth`, authRoutes);
// app.use(`/api/${config.apiVersion}/products`, productRoutes);
// app.use(`/api/${config.apiVersion}/categories`, categoryRoutes);
// app.use(`/api/${config.apiVersion}/cart`, cartRoutes);
// app.use(`/api/${config.apiVersion}/orders`, orderRoutes);
// app.use(`/api/${config.apiVersion}/users`, userRoutes);
// app.use(`/api/${config.apiVersion}/admin`, adminRoutes);

// Development endpoint to test API structure
app.get(`/api/${config.apiVersion}/test`, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API structure test endpoint',
    availableRoutes: {
      auth: `/api/${config.apiVersion}/auth`,
      products: `/api/${config.apiVersion}/products`,
      categories: `/api/${config.apiVersion}/categories`,
      cart: `/api/${config.apiVersion}/cart`,
      orders: `/api/${config.apiVersion}/orders`,
      users: `/api/${config.apiVersion}/users`,
      admin: `/api/${config.apiVersion}/admin`,
    },
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    await redisClient.disconnect();
    logger.info('Redis disconnected');
  } catch (error) {
    logger.error('Error disconnecting Redis:', error);
  }

  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  logger.info(`API available at http://localhost:${config.port}/api/${config.apiVersion}`);
  logger.info(`Health check at http://localhost:${config.port}/health`);
});

export default app;