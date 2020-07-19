const express = require('express');
const router = express.Router();
//const multer = require('multer');
//const path = require('path');
//const fs = require('fs');
const Drink = require('../models/drink');
const Brand = require('../models/brand');
const Review = require('../models/review');
// const uploadPath = path.join('public', Drink.drinkImageBasePath);
 const imageMimeTypes = ['image/jpeg','image/png','image/gif']
// const upload= multer({
//     dest: uploadPath,
//     fileFilter: (req,file, callback) => {
//         callback(null, imageMimeTypes.includes(file.mimetype));
//     }

// })

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

router.post('/', async(req,res) => {
    //const fileName = req.file != null ? req.file.filename : null
    const drink = new Drink({
        name : req.body.name,
        brand: req.body.brand,
        drinkType: req.body.drinkType,
        price: req.body.price,
        aboutDrink: req.body.aboutDrink,
       // drinkImage: fileName
    });
    saveImage(drink,req.body.image)
    try{
        const newDrink = await drink.save();
        res.redirect(`drinks/${drink.id}`);
    }catch{
        // if(drink.drinkImage != null){
        //     removeImage(drink.drinkImage);
        // }
        renderNewPage(res, drink, true);
    }
});

//show drink route
router.get('/:id', async(req,res) => {
    try{
        const drink = await Drink.findById(req.params.id).populate('brand').exec();
        res.render('drinks/show',{
            drink: drink
        })
    }catch{
        res.redirect('/');
    }
})

router.get('/:id/edit', async(req,res) => {
    try{
        const drink = await Drink.findById(req.params.id);
        renderEditPage(res,drink);
    }catch{
        res.redirect('/')
    }
});

//update drink
router.put('/:id', async(req,res) => {
    //const fileName = req.file != null ? req.file.filename : null
    let drink;
    
    try{
        drink = await Drink.findById(req.params.id);
        drink.name = req.body.name;
        drink.brand = req.body.brand;
        drink.drinkType = req.body.drinkType;
        drink.price = req.body.price;
        drink.aboutDrink = req.body.aboutDrink;
        if(req.body.image != null && req.body.image !==''){
            saveImage(drink,req.body.image)
        }
        await drink.save();
        res.redirect(`/drinks/${drink.id}`);
    }catch{
        // if(drink.drinkImage != null){
        //     removeImage(drink.drinkImage);
        // }
        renderNewPage(res, drink, true);
    }
});

//delete drink

router.delete('/:id', async(req,res) => {
    let drink;
    try{
        drink = await Drink.findById(req.params.id)
        await drink.remove();
        res.redirect('/drinks');
    }catch(e){
        if(drink == null){
            res.render('drinks/show', {
                drink: drink,
                errorMessage: 'could not remove drink'
            });
        }else{
            res.redirect(`/drinks/${drink.id}`)
        }
    }
});


//show reviews
router.get('/:id/reviews', async(req,res) => {
    try{
        const drink = await Drink.findById(req.params.id)
        const reviews = await Review.find({drink: drink.id}).limit(20).exec();
        res.render('drinks/reviews', {
            drink:drink,
            reviews: reviews
        })
    }catch{
        res.redirect(`drinks/${drink.id}`);
    }
})

//add reviews
router.post('/:id/reviews', async(req,res) => {
   const drink = await Drink.findById(req.params.id)
    const review = new Review({
        name : req.body.name,
        review: req.body.review,
        drink :drink
        
    });
    try{
        const newReview = await review.save();
        res.redirect(`/drinks/${req.params.id}/reviews`);
    }catch(e){
        res.redirect(`/drinks/${req.params.id}`);
        console.log(e);
    }
})

// function removeImage(fileName){
//     fs.unlink(path.join(uploadPath,fileName), err =>{
//         if(err) console.log(err);
//     })
// }

async function renderNewPage(res, drink,form, hasError = false){
    renderFormPage(res,drink,'new',hasError);
}

async function renderEditPage(res, drink,form, hasError = false){
    renderFormPage(res,drink,'edit',hasError);
}

async function renderFormPage(res, drink,form, hasError = false){
    try{
        const brands = await Brand.find({});
        const params = {
            brands : brands,
            drink : drink
        }
        if(hasError){
            if(form ==="edit"){
                params.errorMessage = 'Error editing page';
            }else{
                params.errorMessage = 'Error creating page';
            }
        } 
        res.render(`drinks/${form}`, params);
    }catch(err){
        res.redirect('/drinks')
    }
}


function saveImage(drink, imageEncoded){
    if(imageEncoded == null)return
    const image = JSON.parse(imageEncoded);

if(image != null &&  imageMimeTypes.includes(image.type)){
    drink.drinkImage = new Buffer.from(image.data, 'base64');
    drink.drinkImageType= image.type;
}
}
module.exports = router;