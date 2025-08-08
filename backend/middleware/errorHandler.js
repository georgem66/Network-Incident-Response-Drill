const errorHandler = (error, req, res, next) => {
  let message = error.message || 'Internal Server Error';
  let statusCode = error.statusCode || 500;
  let errors = null;

  // Sequelize validation errors
  if (error.name === 'SequelizeValidationError') {
    statusCode = 400;
    errors = error.errors.map(err => ({
      field: err.path,
      message: err.message
    }));
    message = 'Validation error';
  }

  // Sequelize unique constraint errors
  if (error.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    errors = error.errors.map(err => ({
      field: err.path,
      message: `${err.path} already exists`
    }));
    message = 'Duplicate entry error';
  }

  // Sequelize foreign key errors
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Invalid reference';
  }

  // MongoDB validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));
    message = 'Validation error';
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Multer errors (file upload)
  if (error.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'File too large';
  }

  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

module.exports = errorHandler;