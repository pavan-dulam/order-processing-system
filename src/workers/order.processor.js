const mongoose = require('mongoose');
const CONFIG = require('../config/config');
const awsService = require('../services/aws.service');
const Order = require('../models/order.model');
const redisClient = require('../config/redis');
const OrderStatus = require('../constants/orderStatus');
const logger = require('../utils/logger');


mongoose.connect(CONFIG.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => logger.info('Worker connected to MongoDB'))
    .catch(err => logger.error('MongoDB connection error in worker: %s', err));

const processOrder = async (orderData) => {
    let status = OrderStatus.PROCESSED;
    try {

        await Order.findByIdAndUpdate(orderData._id, { status });
        orderData.status = status;

        redisClient.setex(`order:${orderData._id}`, 600, JSON.stringify(orderData));

        await awsService.sendEmailNotification(orderData);

        logger.info('Order %s processed successfully.', orderData._id);
    } catch (error) {
        status = OrderStatus.FAILED;
        await Order.findByIdAndUpdate(orderData._id, { status });
        logger.error('Order %s processing failed: %s', orderData._id, error);
    }
};

const startWorker = async () => {
    logger.info('Order processor worker started...');
    while (true) {
        try {
            const message = await awsService.pollSQS();
            if (message) {
                const orderData = JSON.parse(message.Body);
                await processOrder(orderData);
                await awsService.deleteMessageFromQueue(message.ReceiptHandle);
            }
        } catch (error) {
            logger.error('Error in worker loop: %s', error);
        }
    }
};

startWorker();
