const deleteaccountController = require('../controllers/deleteaccountController');
const router= require('express').Router();

router.delete('/',deleteaccountController.handleDeleteAccount);

module.exports = router;