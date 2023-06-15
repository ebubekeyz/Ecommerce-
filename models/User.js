const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: ['true','Please provide a valid name'],
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide a valid email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email'
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password length should not be less than 6'],
        minlength: 6,
        
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
})

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})


UserSchema.methods.comparePassword = async function(candidatePassword){
    const isWait = await bcrypt.compare(candidatePassword, this.password)
    return isWait
}

module.exports = mongoose.model('User', UserSchema)