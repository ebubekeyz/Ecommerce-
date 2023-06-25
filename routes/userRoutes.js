const express = require('express')
const router = express.Router()
const {authenticateUser, authenticatePermissions} = require('../middleware/authentication')

const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    deleteUser, 
} = require('../controllers/userController')

const { getUserOrder } = require('../controllers/orderController')

router.route('/').get(authenticateUser, authenticatePermissions('admin', 'owner'), getAllUsers)
router.route('/showMe').get(authenticateUser, showCurrentUser)
router.route('/updateUser').patch(authenticateUser, updateUser)
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)
router.route('/:id').get(authenticateUser,getSingleUser).delete([authenticateUser, authenticatePermissions('admin')], deleteUser)
router.route('/:id/orders').get(getUserOrder)

module.exports = router