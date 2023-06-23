const Address = require('../models/Address')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const {checkPermissions} = require('../utils')

const createAddress = async(req, res) => {
    req.body.user = req.user.userId
    const address = await Address.create(req.body)
    res.status(StatusCodes.CREATED).json({address})
}

const getAllAddress = async(req, res) => {
    const address = await Address.find({}).populate({
        path: 'user',
        select: 'name email'
    })
    res.status(StatusCodes.OK).json({address, count: address.length})
}

const getSingleAddress = async (req, res) => {
    const {id: addressId} = req.params
    const address = await Address.findOne({_id: addressId})
    if(!addressId){
        throw new CustomError.BadRequestError(`No address with id ${addressId} exist`)
    }
    res.status(StatusCodes.OK).json({address})
}

const updateAddress = async(req, res) => {
    const {deliveryAddress, otherInfo, state, phone1, phone2, city} = req.body
    const {id: addressId} = req.params
    const address = await Address.findOne({_id: addressId})
    if(!addressId){
        throw new CustomError.BadRequestError(`No address with id ${addressId} exist`)
    }
    checkPermissions(req.user, address.user)
    address.deliveryAddress = deliveryAddress
    address.otherInfo = otherInfo
    address.state = state
    address.phone1 = phone1
    address.phone2 = phone2
    address.city = city

    await address.save()
    res.status(StatusCodes.OK).json({msg: 'address successfully updated'})
}

const deleteAddress = async(req, res) => {
    const {id: addressId} = req.params
    const address = await Address.findByIdAndRemove({_id: addressId})
    if(!addressId){
        throw new CustomError.BadRequestError(`No address with id ${addressId} exist`)
    }
    res.status(StatusCodes.OK).json({msg: 'address successfully deleted'})
}

const getSingleUserAddress = async (req, res) => {
    const address = await Address.find({user: req.user.userId})
    res.status(StatusCodes.OK).json({address, count: address.length})
}

module.exports = {createAddress, getAllAddress, getSingleAddress, updateAddress, deleteAddress, getSingleUserAddress}