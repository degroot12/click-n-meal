const router = require('express').Router();
const RecipeModel = require('../models/Recipe.model.js')
const IngredientsModel = require('../models/Ingredients.model.js')
const axios = require('axios')

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

  IngredientsModel.find({})
  .then((data) => {
    let allIngr = data

    res.render('private/create.hbs', {allIngr, username})
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
  const msg = encodeURIComponent('Your recipe has succesfully been created')
  
  RecipeModel.create(newRecipe)
    .then((recipe) => {
      // after creating, show detailspage of recipe
      // passing a msg for on the recipe page
      res.redirect(`/recipe/${recipe._id}/?passMsg=`+ msg)
    })
    .catch((err) => {
      next(err)
    })
})

// GET /edit
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
  const {name, description, ingredients, ingrAmount, ingrUnit, mealType, time, price, image, instructions, creator, source} = req.body
  
  const editedRecipe = {
    name:name, 
    // description:description,
    // ingredients:{
    //   name: ingredients,
    //   amount: ingrAmount,
    //   unit: ingrUnit
    // }, mealType, time, price, image, instructions, creator, source
  }
  console.log('check 1')
  RecipeModel.findByIdAndUpdate(id, editedRecipe)
    .then(() => {
      res.redirect(`/recipe/${id}`)
      console.log('check 2')
    })
    .catch((err) => {
      next(err)
    })
})



module.exports = router
