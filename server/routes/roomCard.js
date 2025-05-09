const roomCardController = require('../controllers/roomCardController');
const verifyJwt = require('../middlewares/verifyJwt');

const router = require('express').Router();

router.get('/getroomcards',verifyJwt,roomCardController.getUserRoomCards);
router.get('/getbyid/:roomId',verifyJwt,roomCardController.getRoomCardbyId);

module.exports = router;