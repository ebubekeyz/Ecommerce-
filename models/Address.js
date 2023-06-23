const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
    deliveryAddress: {
        type: String,
        required: true
    },
    otherInfo: {
        type: String,
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    phone1: {
        type: String,
        required: true
    },
    phone2: {
        type: String,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})


module.exports = mongoose.model('Address', AddressSchema)