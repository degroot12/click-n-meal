const router = require('express').Router();
const RecipeModel = require('../models/Recipe.model.js')
const IngredientsModel = require('../models/Ingredients.model.js')
const axios = require('axios')
const uploader = require('../middlewares/cloudinary.config');

// PROTECTED ROUTES
const checkLoggedInUser = (req, res, next) => {
  if(req.session.loggedInUser){
    next();
  } else {
    res.redirect('/signin')
  }
};

// GET create
router.get('/create', checkLoggedInUser, (req, res, next) => {
  let username = req.session.loggedInUser.username;

  let pictureUploaded 
  if (Object.keys(req.query).length!=0) {
    pictureUploaded = req.query.picture
  }
  console.log('The picture has been uploaded',pictureUploaded)
  // 
  IngredientsModel.find({})
  .then((data) => {
    let allIngr = data

    res.render('private/create.hbs', {allIngr, username, pictureUploaded})
  })
  .catch((err) => {
    console.log(err)
  })
})

// POST route for create
router.post('/create', (req, res, next) => {
  let username = req.session.loggedInUser.username;

  const {newIngredients, elemenRecipeName, elemenDescription,
    elemenInstructions, elemenMealType, elemenTime, elemenPrice, elemenImage, elemenCreator, elemenSource} = req.body
  
    const newRecipe = {
    name:elemenRecipeName, 
    description:elemenDescription,
    ingredients: newIngredients,
    time: elemenTime,
    source:elemenSource,
    creator:username,
    mealType:elemenMealType,
    priceCategory: elemenPrice,
    instructions: elemenInstructions,
    image: elemenImage
  }
  const msg = 'Your recipe has succesfully been created'

  console.log('check here')
  
  RecipeModel.create(newRecipe)
    .then((recipe) => {      
      // after creating, show message of succesfully created     
      // render does not work because of using axios.post in handlebar 'create' 
      res.render('private/create.hbs', {recipe, username, msg})
    })

    .catch((err) => {
      next(err)
    })
})

// GET /edit/:id
router.get('/edit/:id', checkLoggedInUser, (req, res, next) => {
  let username = req.session.loggedInUser.username;
  const id = req.params.id

  RecipeModel.findById(id)
    .populate('allIngr')
    .then((recipe) => {
      res.render('private/edit.hbs', {recipe, username})
      console.log('id (get): ', recipe.id)
    })
    .catch((err) => {
      next(err)
    })  
})

//POST route for editing
router.post('/edit/:id', (req, res, next) => {
  const id = req.params.id;
  // console.log('req body: ', req.body)
  // console.log('req recipeName: ', req.body.recipeName)
  const recipeName = req.body.recipeName
  
  const editedRecipe = {
    name:req.body.recipeName, 
    description:req.body.description,
    // not activated yet
    //  ingredients:{
    //   name: ingredients,
    //   amount: ingrAmount,
    //   unit: ingrUnit
    // }, 
    // mealType, time, price, image, instructions, creator, source
  }

  const msgEdit = 'Your recipe has succesfully been edited'

  RecipeModel.findByIdAndUpdate(id, editedRecipe)
    .then(() => {
      res.redirect(`/recipe/${id}/?passMsgEdit=${msgEdit}`)
      console.log('check 2: ', editedRecipe, msgEdit)
    })
    .catch((err) => {
      next(err)
    })
})

//GET ROUTE FOR UPLOADING
router.get('/upload', (req, res, next) => {
  res.render('private/uploading.hbs')
})

// POST ROUTE OR CLOUDINARY UPLOAD
router.post('/upload', uploader.single('image'), (req, res, next) => {
  console.log('pic info',req.file)
  let picUrl = req.file.path
  const picSend = encodeURIComponent(picUrl)
  console.log('The is the pic we want to send', picSend)
  console.log(decodeURIComponent(picSend))
  res.redirect('/create/?picture=' + picSend)
  // RecipeModel.findByIdAndUpdate(req.session.recipe._id, {recipePic:req.file.path})
  //   .then(() => {
  //     res.redirect('/create')
  //   })
})



module.exports = router
