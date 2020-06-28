const express = require('express');
const router = express.Router();
const Drink = require('../models/drink');
const Brand = require('../models/brand');

//all drinks route
router.get('/', (req,res) => {
    
    res.send('all drinks');
});

//new drink route
router.get('/new', async(req,res) => {
    try{
        const brands = await Brand.find({});
        const drink = new Drink();
        res.render('drinks/new',{
            brands : brands,
            drink : drink
        })
    }catch(err){
        res.redirect('/drinks')
    }
});

//create new drink

router.post('/', (req,res) => {
    const drink = new Drink({
        name : req.body.name,
        brand: req.body.brand,
        drinkType: req.body.drinkType,
        price: req.body.price,
        aboutDrink: req.body.aboutDrink
    })
});

module.exports = router;