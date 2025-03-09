const authService = require('../services/auth.service');
const logger = require('../utils/logger');

exports.register = async (req, res) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        logger.error('Registration error: %s', error);
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

exports.login = async (req, res) => {
    try {
        const result = await authService.loginUser(req.body);
        res.status(200).json(result);
    } catch (error) {
        logger.error('Login error: %s', error);
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

exports.refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshToken(refreshToken);
        res.status(200).json(result);
    } catch (error) {
        logger.error('Token refresh error: %s', error);
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
