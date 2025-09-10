const express = require('express')
const StaffController = require('../controllers/staffController')

const router = express.Router()

router.get('/', StaffController.getStaff)
router.post('/insert', StaffController.insertStaff)
router.post('update/:id', StaffController.updateStaff)
router.delete('/delete', StaffController.deleteStaff)

module.exports = router