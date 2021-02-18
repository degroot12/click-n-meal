const router = require('express').Router();
const RecipeModel = require('../models/Recipe.model.js')
const axios = require('axios')


// POST route for create
router.post('/create', (req, res, next) => {
  const {newIngredients, elemenRecipeName, elemenDescription,
    elemenInstructions, elemenMealType, elemenTime, elemenPrice, elemenImage, elemenCreator, elemenSource} = req.body
  const newRecipe = {
    name:elemenRecipeName, 
    description:elemenDescription,
    ingredients: newIngredients,
    time: elemenTime,
    source:elemenSource,
    creator:elemenCreator,
    mealType:elemenMealType,
    priceCategory: elemenPrice,
    instructions: elemenInstructions,
    image: elemenImage
  }
  console.log(newRecipe.image)
  RecipeModel.create(newRecipe)
    .then(() => {
      res.render('private/create.hbs', {msg: 'Your recipe has succesfully been created!'})
    })
    .catch(() => {
      console.log('error while filling database')
    })
})

// GET route for editing
router.get('/edit/:id', (req, res, next) => {
  const id = req.params.id;
  RecipeModel.findById(id)
    .then((recipe) => {
      res.render('private/edit', {recipe})
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
    description:description,
    ingredients:{
      name: ingredients,
      amount: ingrAmount,
      unit: ingrUnit
    }, mealType, time, price, image, instructions, creator, source
  }
  RecipeModel.findByIdAndUpdate(id, editedRecipe)
    .then(() => {
      res.redirect('/recipe')
    })
    .catch((err) => {
      next(err)
    })
})



module.exports = router
