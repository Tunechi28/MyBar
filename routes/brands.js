const express = require('express');
const Brand = require('../models/brand');
const router =express.Router();
const Drink = require('../models/drink')

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
        res.redirect(`brands/${newBrand.id}`)
    }catch(error){
        res.render('brands/new', {
            brand : brand,
            errorMessage: 'Error creating brand'
           
        });
    }
    
});

router.get('/:id', async(req,res) => {
    try{
        const brand = await Brand.findById(req.params.id);
        const drink = await Drink.find({brand: brand.id}).limit(6).exec();
        res.render('brands/show',{
            brand : brand,
            drinksUnderBrand: drink
        });

    }catch{
        res.redirect('/');
    }
});

router.get('/:id/edit', async(req,res) => {
    try{
        const brand = await Brand.findById(req.params.id);
        res.render('brands/edit', {brand: brand});
    }catch{
        res.redirect('/brands');
    }
});

router.put('/:id', async(req,res) => {
    let brand; 
    try{
        brand = await Brand.findById(req.params.id);
        brand.name = req.body.name;
        await brand.save();
        res.redirect(`/brands/${brand.id}`);
    }catch(error){
        if(brand == null){
            res.redirect('/')
        }else{
        res.render('brands/edit', {
            brand : brand,
            errorMessage: 'Error updating brand'
           
        });
    }
    }
});

router.delete('/:id', async(req,res) => {
    let brand; 
    try{
        brand = await Brand.findById(req.params.id);
        await brand.remove();
        res.redirect('/brands');
    }catch(error){
        if(brand == null){
            res.redirect('/')
        }else{
        res.redirect(`/brands/${brand.id}`);
        }
    }
});
module.exports = router;