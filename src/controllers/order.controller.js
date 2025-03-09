const orderService = require('../services/order.service');
const logger = require('../utils/logger');

exports.createOrder = async (req, res) => {
    try {
        const { items, totalAmount } = req.body;
        const userId = req.user.id;
        const userEmail = req.user.email;

        const order = await orderService.createOrder({ items, totalAmount, userId, userEmail });
        res.status(201).json({ message: 'Order created successfully', orderId: order._id });
    } catch (error) {
        logger.error('Create order error: %s', error);
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

exports.getOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await orderService.getOrder(orderId);
        res.status(200).json(order);
    } catch (error) {
        logger.error('Get order error: %s', error);
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
