const authController = require('../controllers/authController');

const router = require('express').Router();

router.post('/',authController.handleLogin);

module.exports = router;