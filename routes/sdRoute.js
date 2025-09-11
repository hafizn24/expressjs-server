const express = require('express')
const SDController = require('../controllers/sdController')

const router = express.Router()

router.get('/', SDController.getSD)
router.post('/insert', SDController.insertSD)
router.post('/update/:id', SDController.updateSD)
router.delete('/delete', SDController.deleteSD)

module.exports = router