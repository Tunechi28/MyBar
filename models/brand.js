const mongoose  = require('mongoose');
const Drink = require('./drink')

const brandSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    }
});

brandSchema.pre('remove', function(next){
    Drink.find({brand: this.id}, (err, drinks) => {
        if(err){
            next(err)
        }else if(drinks.length> 0){
            next(new Error('This author still has books'));
        }else{
            next();
        }
    })
})

module.exports = mongoose.model('Brand', brandSchema);