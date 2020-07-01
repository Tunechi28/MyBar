const express = require('express');
const router =express.Router();
const Drink = require('../models/drink');

router.get('/', async(req,res) => {
    let drinks;
    try{
        drinks = await Drink.find().sort({createdAt:'desc'}).limit(10).exec();
    }catch{
        drinks =[];
    }
    res.render('index', { drinks: drinks});
});

module.exports = router;