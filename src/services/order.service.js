const { promisify } = require('util');
const Order = require('../models/order.model');
const inventoryService = require('./inventory.service');
const awsService = require('./aws.service');
const redisClient = require('../config/redis');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

// Promisify Redis get and setex methods for easier async/await usage.
const redisGetAsync = promisify(redisClient.get).bind(redisClient);
const redisSetexAsync = promisify(redisClient.setex).bind(redisClient);

exports.createOrder = async ({ items, totalAmount, userId, userEmail }) => {
    const inStock = await inventoryService.checkStock(items);
    if (!inStock) {
        throw new ApiError(400, 'One or more items are out of stock.');
    }

    const order = new Order({
        userId,
        userEmail,
        items,
        totalAmount,
        status: 'Pending'
    });

    await order.save();

    try {
        await awsService.sendOrderToQueue(order);
    } catch (error) {
        logger.error('Error sending order %s to queue: %s', order._id, error);
        throw error;
    }

    return order;
};

exports.getOrder = async (orderId) => {
    try {
        let data = await redisGetAsync(`order:${orderId}`);
        if (data) {
            return JSON.parse(data);
        } else {
            const order = await Order.findById(orderId);
            if (!order) {
                throw new ApiError(404, 'Order not found');
            }

            await redisSetexAsync(`order:${orderId}`, 600, JSON.stringify(order));
            return order;
        }
    } catch (error) {
        throw error;
    }
};
