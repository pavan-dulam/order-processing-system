require('dotenv').config();

const CONFIG = Object.freeze({
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION,
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    AWS: Object.freeze({
        REGION: process.env.AWS_REGION,
        ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        SQS_QUEUE_URL: process.env.SQS_QUEUE_URL,
        SENDER_EMAIL: process.env.SENDER_EMAIL
    }),
    REDIS: Object.freeze({
        HOST: process.env.REDIS_HOST,
        PORT: process.env.REDIS_PORT
    })
});

module.exports = CONFIG;
