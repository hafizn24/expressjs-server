const express = require('express')
const TaskController = require('../controllers/taskController')

const router = express.Router()

router.get('/', TaskController.getTask)
router.post('/insert', TaskController.insertTask)
router.post('/update/:id', TaskController.updateTask)
router.delete('/delete', TaskController.deleteTask)

module.exports = router