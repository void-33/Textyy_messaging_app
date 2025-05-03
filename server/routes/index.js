const router = require('express').Router();

router.use('/auth',require('./auth'));
router.use('/friendrequest',require('./friendrequest'));
router.use('/user',require('./user'));
router.use('/message',require('./message'));
router.use('/roomcards',require('./roomCard'));

module.exports = router;