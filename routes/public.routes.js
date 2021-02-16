
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model.js')
const RecipeModel = require('../models/Recipe.model.js')
// import {querySelector} from "../public/js/script"
// const filterQuery = require("../public/js/script.js")
// const test = require("../public/js/script.js")

//
const checkLoggedInUserHome = (req, res, next) => {
  if(!req.session.loggedInUser){
    next();
  } else {
    res.redirect('/selector')
  }
};

// GET route for the Starter page
router.get('/', checkLoggedInUserHome,(req, res, next) => {
  res.redirect('/selector')
});

// GET Route for recipe page
router.get('/recipe/:id', (req, res, next) => {
  const id = req.params.id
  console.log(req.body)

  res.render('public/recipe.hbs', {id})
});

// GET Route for search page
router.get('/search', (req, res, next) => {
  // const searchTerm = req.query.searchInput
  // request('https://api.spoonacular.com/recipes/complexSearch?query=pasta&apiKey=62f15d05010744ed8127ef36815ed931', function(error, response, body) {
  //     res.render('public/search.hbs', {recipes})
  
  // })
  res.render('public/search.hbs')
      
});

// {mealType:"vegan"}, {mealType:"meat"} 
// GET Route for Selector page
router.get('/selector', (req, res, next) => {

  let mealTypeArr = [{}, {}] //default filter
  let veganOn = req.query.isVegan
  console.log('veganOn: ', veganOn)
  if (veganOn == "veganOn") {
    mealTypeArr.push({mealType:"vegan"})
    console.log('vegan true')
  }
  else if (veganOn == "veganOff") {
    mealTypeArr.pop({mealType:"vegan"})
    console.log('vegan false')
  }
  console.log('mealtype:', mealTypeArr)

  RecipeModel.find({$or: mealTypeArr })
  .then((recipes) => {
    // console.log(recipes)
    res.render('public/selector.hbs', {recipes})
  })
  .catch((err) => {
    next(err)
  })
  // res.render('public/selector.hbs')
});


// GET Route for about page
router.get('/about', (req, res, next) => {
  res.render('public/about.hbs')
});

// GET Route for Ingredients page
router.get('/ingredients', (req, res, next) => {
  res.render('public/ingredients.hbs')
});

// GET Route for Calender page
router.get('/calendar', (req, res, next) => {
  res.render('public/calendar.hbs')
});

module.exports = router;
