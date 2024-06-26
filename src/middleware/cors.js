const cors = require('cors');
const { corsOptions } = require('../config/config');

module.exports = cors(corsOptions);
