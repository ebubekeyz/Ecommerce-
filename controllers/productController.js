const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const path = require('path')
const cloudinary = require('cloudinary').v2
const fs = require('fs')


const createProduct = async(req, res) => {
   
    req.body.user = req.user.userId;
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({product})
}

const getAllProducts = async(req, res) => {
    const products = await Product.find({})
    res.status(StatusCodes.OK).json({products, count: products.length})
}


const getFeaturedProducts = async(req, res) => {
    const products = await Product.find({"featured": true}).sort('createdAt')
    res.status(StatusCodes.OK).json({products, count: products.length})
}

const getSingleProduct = async (req, res) => {
    const {id: productId} = req.params
    const product = await Product.findOne({_id: productId})
    if(!product){
        throw new CustomError.BadRequestError(`No product with id ${productId}`)
    }
    res.status(StatusCodes.OK).json({product})
}

const updateProduct = async (req, res) => {
    const {id: productId} = req.params
    const product = await Product.findOneAndUpdate({_id: productId}, req.body, {
        new: true, 
        runValidators: true
    })
    if(!product){
        throw new CustomError.BadRequestError(`No product with id ${productId}`)
    }
    res.status(StatusCodes.OK).json({product})
}

const deleteProduct = async(req, res) => {
    const {id: productId} = req.params
    const product = await Product.findOne({_id: productId})

    if(!product){
        throw new CustomError.BadRequestError(`No product with id ${productId}`)
    }

    // await product.remove()

    await product.deleteOne()

    res.status(StatusCodes.OK).json({msg: 'Product Removed'})
}

const uploadImage = async(req, res) => {
    if(!req.files){
        throw new CustomError.BadRequestError('No File uploaded')
    }

    let productImage = req.files.image

    if(!productImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequestError('Please upload image')
    }

    const maxSize = 1024 * 1024
    if(productImage.size > maxSize){
        throw new CustomError.BadRequestError(`Please upload image smaller than ${maxSize}`)
    }
    console.log(productImage)
    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`)

    await productImage.mv(imagePath)
    res.status(StatusCodes.OK).json({image: {src: `/uploads/${productImage.name}`}})
    
}

const uploadImageCloud = async(req, res) => {
    console.log(req.files)
    const result = await cloudinary.uploader.upload(
        req.files.images.tempFilePath, {
            use_filename: true, folder: 'ecommerce',
        }
    )
    console.log(result)
    fs.unlinkSync(req.files.images.tempFilePath)
    return res.status(StatusCodes.OK).json({image: {src: result.secure_url}})
}

module.exports = {
    createProduct, 
    getSingleProduct, 
    getAllProducts, 
    updateProduct, 
    deleteProduct, 
    uploadImage,
    uploadImageCloud,
    getFeaturedProducts
}