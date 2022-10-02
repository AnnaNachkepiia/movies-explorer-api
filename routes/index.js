const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { NotFound } = require('../errors/NotFound');
const {
  loginValidate,
  createUserValidate,
} = require('../middlewares/validation');
const { NOT_FOUND_MESSAGE } = require('../consts/errorMessages');

router.post('/signin', loginValidate, login);
router.post('/signup', createUserValidate, createUser);
router.use(auth);
router.use('/', usersRouter);
router.use('/', moviesRouter);
router.use('/*', (req, res, next) => {
  next(new NotFound(NOT_FOUND_MESSAGE));
});

module.exports = router;
