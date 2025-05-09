const roomController = require('../controllers/roomController');
const verifyJwt = require('../middlewares/verifyJwt');

const router = require('express').Router();

router.get('/getbyid/:roomId',verifyJwt,roomController.getRoomById);

module.exports = router;