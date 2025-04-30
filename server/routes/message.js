const router = require('express').Router();
const messageController = require('../controllers/messageController');
const verifyJwt = require('../middlewares/verifyJwt');

router.post('/send', messageController.sendMessage);
router.get('/get/:receiverId',verifyJwt, messageController.getMessages);

module.exports = router;