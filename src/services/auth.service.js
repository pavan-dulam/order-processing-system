const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const CONFIG = require('../config/config');
const logger = require('../utils/logger');
const ApiError = require('../utils/apiError');

exports.registerUser = async ({ username, email, password }) => {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, 'Email already in use');
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    return { message: 'User registered successfully', userId: user._id };
};

exports.loginUser = async ({ email, password }) => {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400, 'Invalid credentials');
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw new ApiError(400, 'Invalid credentials');
    }

    // Generate tokens
    const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        CONFIG.JWT_SECRET,
        { expiresIn: CONFIG.JWT_EXPIRATION }
    );
    const refreshToken = jwt.sign(
        { id: user._id, email: user.email },
        CONFIG.REFRESH_TOKEN_SECRET,
        { expiresIn: CONFIG.REFRESH_TOKEN_EXPIRATION }
    );

    // Store refresh token with the user document
    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
};

exports.refreshToken = async (providedRefreshToken) => {
    if (!providedRefreshToken) {
        throw new ApiError(400, 'Refresh token is required');
    }

    let decoded;
    try {
        decoded = jwt.verify(providedRefreshToken, CONFIG.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(403, 'Invalid refresh token');
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== providedRefreshToken) {
        throw new ApiError(403, 'Invalid refresh token');
    }

    const newAccessToken = jwt.sign(
        { id: user._id, email: user.email },
        CONFIG.JWT_SECRET,
        { expiresIn: CONFIG.JWT_EXPIRATION }
    );
    return { accessToken: newAccessToken };
};
