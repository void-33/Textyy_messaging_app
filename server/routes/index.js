const router = require('express').Router();

router.use('/register',require('./register'));
router.use('/auth',require('./auth'));
router.use('/logout',require('./logout'));
router.use('/deleteaccount',require('./deleteaccount'));
router.use('/newtoken',require('./newtoken'));

module.exports = router;