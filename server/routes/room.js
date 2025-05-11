const roomController = require('../controllers/roomController');
const verifyJwt = require('../middlewares/verifyJwt');

const router = require('express').Router();

router.get('/getbyid/:roomId',verifyJwt,roomController.getRoomById);
router.post('/create',verifyJwt,roomController.createGroup);
router.patch('/rename',verifyJwt,roomController.renameGroup);

module.exports = router;