const mongoose = require('mongoose');
const drinkImageBasePath = 'uploads/drinkImages'
const path = require('path');

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

drinkSchema.virtual('drinkImagePath').get(function(){
    if(this.drinkImage != null){
        return path.join('/',drinkImageBasePath,this.drinkImage);
    }
})
module.exports = mongoose.model('Drink', drinkSchema);
module.exports.drinkImageBasePath = drinkImageBasePath;