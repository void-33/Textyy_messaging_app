const authController = require('../controllers/authController');

const router = require('express').Router();

router.post('/register',authController.handleRegister);
router.post('/login',authController.handleLogin);
router.get('/logout',authController.handleLogout);
router.delete('/deleteaccount',authController.handleDeleteAccount);
router.get('/newtoken',authController.handleNewAccessToken);
router.get('/verifytoken',authController.handleAccessTokenVerification);
router.get('/verify-email',authController.handleEmailVerification);


module.exports = router;