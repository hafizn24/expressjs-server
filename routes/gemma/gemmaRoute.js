const express = require('express')
const GemmaController = require('../../controllers/gemma/gemmaController')

const router = express.Router()

router.post('/', GemmaController.setChat)

module.exports = router