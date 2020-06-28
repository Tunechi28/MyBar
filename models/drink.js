const mongoose = require('mongoose');

const drinkSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    aboutDrink : {
        type: String
    },
    price : {
        type: Number,
        required: true,
    },
    drinkType : {
        type: String,
        required: true
    },
    createdAt : {
        type: Date,
        default: Date.now,
        required: true
    },
    drinkImage : {
        type: String,
        required: true
    },
    brand : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    }
})

module.exports = mongoose.model('Drink', drinkSchema);