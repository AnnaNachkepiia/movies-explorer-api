const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequest } = require('../errors/BadRequest');
const { NotFound } = require('../errors/NotFound');
const { Conflict } = require('../errors/Conflict');
const {
  BAD_REQ_USER_CREATE,
  DOUBLE_EMAIL,
  USER_NOT_FOUND,
  USERID_NOT_FOUND,
  BAD_REQ_USER_UPDATE,
} = require('../consts/errorMessages');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      const userData = {
        email: user.email,
        name: user.name,
        _id: user._id,
      };
      res.send(userData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_REQ_USER_CREATE));
        return;
      }
      if (err.code === 11000) {
        next(new Conflict(DOUBLE_EMAIL));
        return;
      }
      next(err);
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound(USER_NOT_FOUND);
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { email: req.body.email, name: req.body.name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFound(USERID_NOT_FOUND);
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict(DOUBLE_EMAIL));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_REQ_USER_UPDATE));
      } else next(err);
    });
};

module.exports = {
  login,
  createUser,
  getUserInfo,
  updateProfile,
};
