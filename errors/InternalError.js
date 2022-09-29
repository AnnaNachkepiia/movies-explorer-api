const { INTERNAL_ERROR } = require('./errorCode');

class InternalError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INTERNAL_ERROR;
  }
}

module.exports = {
  InternalError,
};
