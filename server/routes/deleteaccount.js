const deleteaccountController = require('../controllers/deleteaccountController');
const router= require('express').Router();

router.get('/',deleteaccountController.handleDeleteAccount);

module.exports = router;