require('dotenv').config();

const corsOptions = {
    origin: '*',
    methods: ['POST', 'GET', 'PUT'],
    allowedHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning'],
};

const PORT = process.env.SERVER_PORT || 5000;

module.exports = {
    corsOptions,
    PORT,
};
