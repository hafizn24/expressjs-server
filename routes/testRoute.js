const express = require('express')
const TestController = require('../controllers/testController')

const router = express.Router();

router.get('/', TestController.getTest)

module.exports = router;