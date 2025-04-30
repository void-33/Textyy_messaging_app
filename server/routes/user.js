const router = require('express').Router();
const userController = require('../controllers/userController');
const verifyJwt = require('../middlewares/verifyJwt');

router.post('/getbyusername',verifyJwt,userController.getbyUsername);
router.get('/getfriends',verifyJwt, userController.getFriends);

module.exports = router;