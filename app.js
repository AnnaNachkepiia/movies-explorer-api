require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const errorsType = require('./middlewares/errorsType');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { FILM_DB_DEV } = require('./consts/dbPath');
const limiter = require('./middlewares/rateLimiter');

const { NODE_ENV, FILM_DB } = process.env;
const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(NODE_ENV === 'production' ? FILM_DB : FILM_DB_DEV, {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(helmet());
app.use(requestLogger);
app.use(cors);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorsType);

app.listen(PORT, () => {});
