const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    drink: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drink',
        required: true
    }
});


module.exports = mongoose.model('Review', reviewSchema);
