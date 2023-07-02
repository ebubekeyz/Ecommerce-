const express = require('express')
const router = express.Router()
const {authenticateUser, authenticatePermissions} = require('../middleware/authentication')

const {
    createProduct, 
    getSingleProduct, 
    getAllProducts, 
    updateProduct, 
    deleteProduct, 
    uploadImage,
    uploadImageCloud,
    getFeaturedProducts
} = require('../controllers/productController')

const {getSingleProductReviews} = require('../controllers/reviewController')

router.route('/featured').get(getFeaturedProducts)
router
.route('/')
.post(authenticateUser, createProduct).get([authenticateUser], getAllProducts)
router.route('/uploadImage')
.post([authenticateUser, authenticatePermissions('admin')],uploadImage)
router.route('/uploadImageCloud').post([authenticateUser, authenticatePermissions('admin')],uploadImageCloud)
router.route('/:id')
.get(getSingleProduct)
.patch([authenticateUser, authenticatePermissions('admin')],updateProduct)
.delete([authenticateUser, authenticatePermissions('admin')], deleteProduct)
router.route('/:id/reviews').get(getSingleProductReviews)

module.exports = router