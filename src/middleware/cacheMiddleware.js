const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

function cacheMiddleware(req, res, next) {
  const key = req.originalUrl || req.url;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    return res.send(cachedResponse);
  }

  res.sendResponse = res.send;
  res.send = (body) => {
    cache.set(key, body);
    res.sendResponse(body);
  };

  next();
}

function clearCache(key) {
  cache.del(key);
}

function clearAllCache() {
  cache.flushAll();
}

module.exports = { cacheMiddleware, clearCache, clearAllCache };
