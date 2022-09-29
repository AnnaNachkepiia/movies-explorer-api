const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserInfo, updateProfile } = require('../controllers/users');

router.get('/users/me', getUserInfo);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email(),
    }),
  }),
  updateProfile,
);

module.exports = router;
