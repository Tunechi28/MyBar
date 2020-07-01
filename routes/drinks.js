const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Drink = require('../models/drink');
const Brand = require('../models/brand');
const uploadPath = path.join('public', Drink.drinkImageBasePath);
const imageMimeTypes = ['image/jpeg','image/png','image/gif']
const upload= multer({
    dest: uploadPath,
    fileFilter: (req,file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
    }

})

//all drinks route
router.get('/', async(req,res) => {
    let query = Drink.find();
    if(req.query.name !=null && req.query.name !== ''){
        query = query.regex('name', new RegExp(req.query.name, 'i'));
        
    }
    if(req.query.drinkType !=null && req.query.drinkType !== ''){
        query = query.regex('drinkType', new RegExp(req.query.drinkType, 'i'));
        
    }
    try{
        const drinks = await query.exec();
        res.render('drinks/index', {
            searchOptions: req.query,
            drinks: drinks
        })
    }catch{
        res.redirect('/')
    }
    
});

//new drink route
router.get('/new', async(req,res) => {
    renderNewPage(res, new Drink());
});

//create new drink

router.post('/', upload.single('image'), async(req,res) => {
    const fileName = req.file != null ? req.file.filename : null
    const drink = new Drink({
        name : req.body.name,
        brand: req.body.brand,
        drinkType: req.body.drinkType,
        price: req.body.price,
        aboutDrink: req.body.aboutDrink,
        drinkImage: fileName
    });
    try{
        const newDrink = await drink.save();
        res.redirect('drinks')
    }catch{
        if(drink.drinkImage != null){
            removeImage(drink.drinkImage);
        }
        renderNewPage(res, drink, true);
    }
});

function removeImage(fileName){
    fs.unlink(path.join(uploadPath,fileName), err =>{
        if(err) console.log(err);
    })
}

async function renderNewPage(res, drink, hasError = false){
    try{
        const brands = await Brand.find({});
        const params = {
            brands : brands,
            drink : drink
        }
        if(hasError) params.errorMessage = 'Error creating page'
        res.render('drinks/new', params);
    }catch(err){
        res.redirect('/drinks')
    }
}

module.exports = router;