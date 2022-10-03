const { SERVER_ERR } = require('../consts/errorMessages');

module.exports = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: SERVER_ERR });
  }
  next();
};
