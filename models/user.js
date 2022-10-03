const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { Unauthorized } = require('../errors/Unauthorized');
const { EMAIL_OR_PASSWD_ERR } = require('../consts/errorMessages');

const userSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    unique: true,
    validate: { validator: validator.isEmail },
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function Auth(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then(async (user) => {
      if (!user) {
        return Promise.reject(
          new Unauthorized(EMAIL_OR_PASSWD_ERR),
        );
      }

      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        return Promise.reject(
          new Unauthorized(EMAIL_OR_PASSWD_ERR),
        );
      }
      return user;
    });
};

module.exports = mongoose.model('user', userSchema);
