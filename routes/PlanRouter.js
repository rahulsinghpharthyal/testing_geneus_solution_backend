const express = require('express')
const router = express.Router()
const {updateToPremium} = require('../controllers/PlanController')
const {Auth} = require('../controllers/AuthController')
router.put('/',Auth, updateToPremium)

module.exports = router