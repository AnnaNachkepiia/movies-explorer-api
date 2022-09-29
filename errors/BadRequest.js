const { BAD_REQUEST } = require('./errorCode');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = {
  BadRequest,
};
