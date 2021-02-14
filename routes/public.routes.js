const router = require('express').Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model.js')
const RecipeModel = require('../models/Recipe.model.js')

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
  res.render('public/home.hbs')
});

// GET Route for recipe page
router.get('/recipe', (req, res, next) => {
  res.render('public/recipe.hbs')
});

// GET Route for search page
router.get('/search', (req, res, next) => {
  const searchTerm = req.query.searchInput
  request('https://api.spoonacular.com/recipes/complexSearch?query=pasta&apiKey=62f15d05010744ed8127ef36815ed931', function(error, response, body) {
      res.render('public/search.hbs', {recipes})
  
  })
  res.render('public/search.hbs')
      
});

// GET Route for Selector page
router.get('/selector', (req, res, next) => {
  RecipeModel.find()
  .then((recipes) => {
    res.render('public/search.hbs', {recipes})
  })
  res.render('public/selector.hbs')
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
