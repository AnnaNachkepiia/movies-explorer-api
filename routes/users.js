const router = require('express').Router();
const { getUserInfo, updateProfile } = require('../controllers/users');
const { updateProfileValidate } = require('../middlewares/validation');

router.get('/users/me', getUserInfo);
router.patch('/users/me', updateProfileValidate, updateProfile);

module.exports = router;
