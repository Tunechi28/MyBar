const express = require('express');
const Brand = require('../models/brand');
const router =express.Router();

//All brands route
router.get('/', async(req,res) => {
    let searchOptions ={};
    if(req.query.name !=null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    try{
        const brands = await Brand.find(searchOptions);
        res.render('brands/index', {
            brands : brands,
            searchOptions:req.query
        })
    }catch{
        res.redirect('/')
    }
});

//new brand route
router.get('/new', (req,res) => {
    res.render('brands/new', {brand: new Brand()});
});

//create brand route
router.post('/', async(req,res) => {
    //const error ={errorMessage : "error creating brand"}
    const brand = new Brand({
        name: req.body.name
    })
    try{
        const newBrand = await brand.save();
        res.redirect('brands')
    }catch(error){
        res.render('brands/new', {
            brand : brand,
            errorMessage: 'Error creating brand'
           
        });
    }
    
});

module.exports = router;