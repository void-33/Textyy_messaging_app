const router = require('express').Router();
const friendRequestController = require('../controllers/friendRequestController');
const verifyJwt = require('../middlewares/verifyJwt');

router.post('/send',verifyJwt,friendRequestController.sendFriendRequest);
router.patch('/accept/:requestId',verifyJwt,friendRequestController.acceptFriendRequest);
router.delete('/decline/:requestId',verifyJwt, friendRequestController.declineFriendRequest);
router.delete('/cancel/:requestId',verifyJwt, friendRequestController.cancelFriendRequest);
router.get('/getpending',verifyJwt, friendRequestController.getPendingRequests);

module.exports = router;