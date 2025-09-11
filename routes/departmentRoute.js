const express = require('express')
const DepartmentController = require('../controllers/departmentController')

const router = express.Router()

router.get('/', DepartmentController.getDepartment)
router.post('/insert', DepartmentController.insertDepartment)
router.post('/update/:id', DepartmentController.updateDepartment)
router.delete('/delete', DepartmentController.deleteDepartment)

module.exports = router