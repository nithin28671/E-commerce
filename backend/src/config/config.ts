import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',

  // Database
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
  mongodbTestUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/ecommerce_test',

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],

  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',

  // Cloudinary
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
  cloudinaryFolder: process.env.CLOUDINARY_FOLDER || 'ecommerce',

  // Email
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  fromEmail: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
  fromName: process.env.FROM_NAME || 'E-Commerce Platform',

  // File Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/webp',
  ],

  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),

  // Password Reset
  passwordResetExpiresIn: process.env.PASSWORD_RESET_EXPIRES_IN || '10m',

  // Email Confirmation
  emailConfirmationExpiresIn: process.env.EMAIL_CONFIRMATION_EXPIRES_IN || '24h',

  // Cart
  cartExpiryHours: parseInt(process.env.CART_EXPIRY_HOURS || '720'), // 30 days

  // Cache TTL
  cacheTtlProducts: parseInt(process.env.CACHE_TTL_PRODUCTS || '300'), // 5 minutes
  cacheTtlCategories: parseInt(process.env.CACHE_TTL_CATEGORIES || '3600'), // 1 hour
  cacheTtlUser: parseInt(process.env.CACHE_TTL_USER || '900'), // 15 minutes

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  logFile: process.env.LOG_FILE || 'logs/app.log',

  // Security
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  sessionSecret: process.env.SESSION_SECRET || 'your-session-secret',

  // Admin
  adminEmail: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!',

  // Development
  skipEmailVerification: process.env.SKIP_EMAIL_VERIFICATION === 'true',
  skipRateLimiting: process.env.SKIP_RATE_LIMITING === 'true',
};

// Validate required environment variables
export const validateConfig = (): void => {
  const requiredEnvVars = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'MONGODB_URI',
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    console.error('Please check your .env file');
    process.exit(1);
  }

  // Log configuration in development
  if (config.nodeEnv === 'development') {
    console.log('Configuration loaded:', {
      port: config.port,
      nodeEnv: config.nodeEnv,
      mongodbUri: config.mongodbUri.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
      redisUrl: config.redisUrl,
      stripeConfigured: !!config.stripeSecretKey,
      cloudinaryConfigured: !!config.cloudinaryApiKey,
      sendgridConfigured: !!config.sendgridApiKey,
    });
  }
};