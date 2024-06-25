const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./src/routes');
const app = express();
const cors = require('./src/middleware/cors');
const { logger, morganMiddleware } = require('./src/utils/logger');
const { PORT } = require('./src/config/config');

app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(cors);
app.use(morganMiddleware);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});
app.use(limiter);

app.use('/api', routes);

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, '0.0.0.0', () => logger.info(`Server running on port ${PORT}`));
