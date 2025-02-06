require('dotenv').config();

const express = require('express');
const app = express();
const router = require('./routes/routes');
const errorHandler = require('./middlewares/errorMiddleware');
const Logger = require('./middlewares/loggerMiddleware');


app.use(express.json());

app.use(router)
app.use(Logger.monitor);
app.use(errorHandler)

module.exports = app;
