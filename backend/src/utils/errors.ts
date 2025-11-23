import { NextFunction, Request, Response } from 'express';
import { logger } from './logger';

// Base error class
export abstract class AppError extends Error {
  abstract statusCode: number;
  abstract isOperational: boolean;

  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Custom error classes
export class ValidationError extends AppError {
  statusCode = 400;
  isOperational = true;

  constructor(message: string, public readonly details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  statusCode = 404;
  isOperational = true;

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  statusCode = 401;
  isOperational = true;

  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  statusCode = 403;
  isOperational = true;

  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  statusCode = 409;
  isOperational = true;

  constructor(message: string = 'Conflict') {
    super(message);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  statusCode = 429;
  isOperational = true;

  constructor(message: string = 'Too many requests') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class PaymentError extends AppError {
  statusCode = 400;
  isOperational = true;

  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'PaymentError';
  }
}

export class ExternalServiceError extends AppError {
  statusCode = 502;
  isOperational = true;

  constructor(service: string, message: string = 'External service error') {
    super(`${service}: ${message}`);
    this.name = 'ExternalServiceError';
  }
}

export class DatabaseError extends AppError {
  statusCode = 500;
  isOperational = true;

  constructor(message: string = 'Database error') {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Error handling middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: any = undefined;

  // Handle known error types
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;

    if (error instanceof ValidationError) {
      details = error.details;
    }
  } else if (error.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    message = 'Validation Error';
    details = Object.values((error as any).errors).map((err: any) => ({
      field: err.path,
      message: err.message,
    }));
  } else if (error.name === 'CastError') {
    // Mongoose cast error
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (error.name === 'MongoError' && (error as any).code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    message = 'Duplicate field value';
    details = {
      field: Object.keys((error as any).keyValue)[0],
      value: Object.values((error as any).keyValue)[0],
    };
  } else if (error.name === 'JsonWebTokenError') {
    // JWT error
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    // JWT expiration error
    statusCode = 401;
    message = 'Token expired';
  } else if (error.name === 'MulterError') {
    // Multer error
    statusCode = 400;
    message = 'File upload error';
    if ((error as any).code === 'LIMIT_FILE_SIZE') {
      message = 'File too large';
    }
  }

  // Log error
  logger.error('Error occurred:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    statusCode,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Send error response
  const errorResponse: any = {
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  if (details) {
    errorResponse.details = details;
  }

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response): void => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  res.status(404).json({
    success: false,
    error: error.message,
  });
};