// 404 Not Found middleware
export const notFound = (req, res, next) => {
  // Skip logging for common health check paths and favicon requests
  const skipLogging = [
    '/favicon.ico',
    '/robots.txt',
    '/.well-known'
  ].some(path => req.originalUrl.startsWith(path));

  if (!skipLogging && process.env.NODE_ENV !== 'production') {
    // Only log in development to reduce noise in production
    console.warn(`⚠️  404: ${req.method} ${req.originalUrl}`);
  }

  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

