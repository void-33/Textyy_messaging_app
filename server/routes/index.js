const router = require('express').Router();

router.use('/auth',require('./auth'));
router.use('/friendrequest',require('./friendrequest'));
router.use('/user',require('./user'));
router.use('/message',require('./message'));

module.exports = router;