// src/middleware/logger.js
const morgan = require('morgan');
const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// Add console logging for development environment
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }));
}

// Morgan middleware for logging HTTP requests
const morganMiddleware = morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim()), // Use 'silly' log level
    },
});

module.exports = { logger, morganMiddleware };
