require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const errorsType = require('./middlewares/errorsType');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NODE_ENV, FILM_DB } = process.env;
const { PORT = 3000 } = process.env;
const app = express();

// mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {});
mongoose.connect(NODE_ENV === 'production' ? FILM_DB : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});
app.use(express.json());
app.use(helmet());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorsType);

app.listen(PORT, () => {});
