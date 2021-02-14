const router = require('express').Router();
const RecipeModel = require('../models/Recipe.model.js')

router.post('/create', (req, res, next) => {
  const {name, description, ingredients, ingrAmount, ingrUnit, mealType, time, price, image, instructions, creator, source} = req.body
  console.log(req.body)
  const newRecipe = {
    name, description, ingredients, ingrAmount, ingrUnit, mealType, time, price, image, instructions, creator, source
  }
  RecipeModel.create(newRecipe)
    .then(() => {
      res.render('private/create.hbs', {msg: 'Your recipe has succesfully been created!'})
    })
    .catch(() => {
      console.log('error while filling database')
    })
})


module.exports = router
