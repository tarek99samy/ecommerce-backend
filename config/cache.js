require('dotenv').config();
const redis = require('redis');

const redisClient = redis.createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (err) => {
  console.error(`Redis error: ${err}`);
});

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
