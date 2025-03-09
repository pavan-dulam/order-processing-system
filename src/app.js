const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const CONFIG = require('./config/config');
const logger = require('./utils/logger');


const authRoutes = require('./routes/auth.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();


app.use(bodyParser.json());


mongoose.connect(CONFIG.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection error: %s', err));


app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);


app.use((err, req, res, next) => {
  logger.error('Global error handler: %s', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(CONFIG.PORT, () => {
  logger.info(`Server running on port ${CONFIG.PORT}`);
});
