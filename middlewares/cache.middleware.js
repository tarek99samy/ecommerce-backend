const httpStatus = require('http-status');
const redisClient = require('../config/cache');

//  keys is related logically to LIST of keys so that flushing all together
const prefixMapping = {
  product: ['product', 'ad'],
  ad: ['product', 'ad'],
  favouriteproduct: ['product', 'ad'],
  'upload-file': ['product', 'ad']
};

const checkCache = async (req, res, next) => {
  try {
    const prefix = req.originalUrl.split('v1/')[1].split('/')[0];
    if (req.method === 'GET') {
      const key = `${prefix}:${req.originalUrl}_${req.get('userId')}_${req.get('lang')}_${req.get('countryId')}`;
      const data = await redisClient.get(key);
      if (data) {
        console.log(`[CACHE HIT]: ${key}`);
        return res.status(httpStatus.OK).json({ [prefix + 's']: JSON.parse(data) });
      } else {
        req.headers['cacheKey'] = key;
        next();
      }
    } else {
      for (const tmpPrefix of prefixMapping[prefix]) {
        const keys = await redisClient.keys(`${tmpPrefix}:*`);
        if (keys.length > 0) {
          console.log(`[CACHE CLEAR FOR]: ${tmpPrefix}`);
          await redisClient.del(keys);
        } else {
          console.log(`[CACHE NOT FOUND FOR]: ${tmpPrefix}`);
        }
      }
      next();
    }
  } catch (error) {
    console.log(`[CACHE ERROR]: ${error}`);
    next(error);
  }
};

module.exports = checkCache;
