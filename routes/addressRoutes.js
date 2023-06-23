const express = require('express')

const router = express.Router()

const {authenticateUser, authenticatePermissions} = require('../middleware/authentication')

const {createAddress, getAllAddress, getSingleAddress, updateAddress, deleteAddress} = require('../controllers/addressController')


router.route('/').get([authenticateUser], getAllAddress).post([authenticateUser], createAddress)
router.route('/:id').patch([authenticateUser], updateAddress).delete([authenticateUser, authenticatePermissions('admin')], deleteAddress).get([authenticateUser], getSingleAddress)

module.exports = router