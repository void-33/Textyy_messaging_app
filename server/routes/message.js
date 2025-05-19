const router = require('express').Router();
const messageController = require('../controllers/messageController');
const verifyJwt = require('../middlewares/verifyJwt');

router.post('/send',verifyJwt, messageController.sendMessage);
router.get('/get/:roomId',verifyJwt, messageController.getMessages);

module.exports = router;