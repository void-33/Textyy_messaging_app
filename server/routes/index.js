const router = require('express').Router();

router.use('/auth',require('./auth'));
router.use('/friendrequest',require('./friendrequest'));
router.use('/user',require('./user'));
router.use('/messages',require('./message'));
router.use('/roomcards',require('./roomCard'));
router.use('/rooms',require('./room'));

module.exports = router;