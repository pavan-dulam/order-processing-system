const redis = require('redis');
const CONFIG = require('../config/config');
const logger = require('../utils/logger');

const redisClient = redis.createClient({
    host: CONFIG.REDIS.HOST,
    port: CONFIG.REDIS.PORT
});

redisClient.on('error', (err) => {
    logger.error('Redis error:', err);
});

redisClient.on('connect', () => {
    logger.info('Connected to Redis');
});

module.exports = redisClient;
