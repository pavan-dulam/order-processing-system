const AWS = require('aws-sdk');
const CONFIG = require('../config/config');
const Order = require('../models/order.model');
const logger = require('../utils/logger');

AWS.config.update({
    region: CONFIG.AWS.REGION,
    accessKeyId: CONFIG.AWS.ACCESS_KEY_ID,
    secretAccessKey: CONFIG.AWS.SECRET_ACCESS_KEY
});

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const ses = new AWS.SES({ apiVersion: '2010-12-01' });
const queueUrl = CONFIG.AWS.SQS_QUEUE_URL;

exports.sendOrderToQueue = async (order) => {
    const params = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(order)
    };
    try {
        await sqs.sendMessage(params).promise();
        logger.info('Order %s sent to queue', order._id);
    } catch (error) {
        logger.error('Error sending order %s to queue: %s', order._id, error);
        throw error;
    }
};

exports.pollSQS = async () => {
    const params = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 20
    };
    const data = await sqs.receiveMessage(params).promise();
    if (data.Messages && data.Messages.length > 0) {
        return data.Messages[0];
    }
    return null;
};

exports.deleteMessageFromQueue = async (receiptHandle) => {
    const params = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle
    };
    await sqs.deleteMessage(params).promise();
    logger.info('Deleted message from queue');
};

exports.sendEmailNotification = async (order) => {

    const params = {
        Destination: {
            ToAddresses: [order.userEmail]
        },
        Message: {
            Body: {
                Text: {
                    Data: `Your order ${order._id} has been processed.\nItems: ${order.items.join(', ')}\nStatus: ${order.status}`
                }
            },
            Subject: {
                Data: 'Order Confirmation'
            }
        },
        Source: CONFIG.AWS.SENDER_EMAIL
    };
    try {
        await ses.sendEmail(params).promise();
        logger.info('Email notification sent for order %s', order._id);
    } catch (error) {
        logger.error('Error sending email for order %s: %s', order._id, error);
        throw error;
    }
};
