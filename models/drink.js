const mongoose = require('mongoose');
// const drinkImageBasePath = 'uploads/drinkImages'
// const path = require('path');

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
        type: Buffer,
        required: true
    },
    drinkImageType: {
        type: String,
        required: true
    },
    brand : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    }
})

drinkSchema.virtual('drinkImagePath').get(function(){
    if(this.drinkImage != null && this.drinkImageType != null){
        return `data:${this.drinkImageType};charset=utf-8;base64,${this.drinkImage.toString('base64')}`
    }
})
module.exports = mongoose.model('Drink', drinkSchema);
//module.exports.drinkImageBasePath = drinkImageBasePath;