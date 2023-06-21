const express = require('express')

const router = express.Router()

const {authenticateUser, authenticatePermissions} = require('../middleware/authentication')

const {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder,
    deleteOrder
} = require('../controllers/orderController')

router.route('/').get([authenticateUser, authenticatePermissions('admin')], getAllOrders).post(authenticateUser, createOrder)
router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders)
router.route('/:id').get(authenticateUser, getSingleOrder).patch(authenticateUser, updateOrder).delete([authenticateUser, authenticatePermissions('admin')], deleteOrder)


module.exports = router