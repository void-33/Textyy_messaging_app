const newtokenController = require('../controllers/newtokenController.js');

const router = require('express').Router();

router.get('/',newtokenController.handleNewToken);

module.exports = router;