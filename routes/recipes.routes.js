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
  const msg = 'Your recipe has succesfully been created!'
  
  RecipeModel.create(newRecipe)
    .then(() => {
      res.render('private/create.hbs', {msg, username})
      console.log(msg)
      console.log(username)
    })
    .catch(() => {
      console.log('error while filling database')
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
      // console.log(recipe)
    })
    .catch((err) => {
      next(err)
    })  
})

// POST /edit
// router.post('/edit/:id', checkLoggedInUser, (req, res, next) => {
//   const id = req.params.id
//   const {name, description, ingredients, ingrAmount, ingrUnit, mealType, time, price, image, instructions, creator, source} = req.body

//   let updateRecipe = {
//     name: recipeName
//   }

//   RecipeModel.findByIdAndUpdate(id, updateRecipe)
//     .then(() => {
//       res.redirect('/selector')
//       console.log('save ', updateRecipe)
//     })
//     .catch((err) => {
//       next(err)
//     })
// })




// //POST route for editing
// router.post('/edit/:id', (req, res, next) => {
//   const id = req.params.id;
//   const {name, description, ingredients, ingrAmount, ingrUnit, mealType, time, price, image, instructions, creator, source} = req.body
//   const editedRecipe = {
//     name:name, 
//     description:description,
//     ingredients:{
//       name: ingredients,
//       amount: ingrAmount,
//       unit: ingrUnit
//     }, mealType, time, price, image, instructions, creator, source
//   }
//   RecipeModel.findByIdAndUpdate(id, editedRecipe)
//     .then(() => {
//       res.redirect('/recipe')
//     })
//     .catch((err) => {
//       next(err)
//     })
// })



module.exports = router
