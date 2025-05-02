const router = require('express').Router();
const userController = require('../controllers/userController');
const verifyJwt = require('../middlewares/verifyJwt');

router.get('/getidbyusername/:username',verifyJwt,userController.getIdbyUsername);
router.get('/getfriends',verifyJwt, userController.getFriends);
router.get('/search',verifyJwt, userController.searchUsers);
router.delete('/unfriend/:otherUserId',verifyJwt, userController.unfriendUser)

module.exports = router;