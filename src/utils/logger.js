const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');

const logDir = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'order-processing-system' },
    transports: [
        new transports.Console(),
        new transports.File({ filename: path.join(logDir, 'app.log') })
    ]
});

module.exports = logger;
