const express = require('express')
const CartController = require('../controllers/cartController')

const router = express.Router()

router.get('/', CartController.getCart)

module.exports = router