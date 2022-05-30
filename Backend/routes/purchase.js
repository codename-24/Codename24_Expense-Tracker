const express = require('express');

const purchaseController = require('../controller/purchase');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/premiummembership', authenticatemiddleware.authenticate,purchaseController.purchasepremium);

router.post('/updatetransactionstatus', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatus)

router.get('/ispremium', authenticatemiddleware.authenticate, purchaseController.isPremium)

module.exports = router;