const authController = require('../controllers/authController');

const router = require('express').Router();

router.post('/register',authController.handleRegister);
router.post('/login',authController.handleLogin);
router.get('/logout',authController.handleLogout);
router.delete('/deleteaccount',authController.handleDeleteAccount);
router.get('/newaccesstoken',authController.handleNewAccessToken);


module.exports = router;