
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
router.get('/',(req, res, next) => {
  console.log('-------------COMING HERE---------------')
  res.redirect('/selector')
});

// GET Route for recipe page
router.get('/recipe/:id', (req, res, next) => {
  const id = req.params.id
  
  // if msg needs to be appear after creating new recipe
  // let msgNewRecipeCreated 
  // if (Object.keys(req.query).length!=0) {
  //   msgNewRecipeCreated = req.query.passMsgEdit
  // }
  // console.log(msgNewRecipeCreated)


  // message when recipe is updates
  let msgEditRecipe
  if (Object.keys(req.query).length!=0) {
    msgEditRecipe = req.query.passMsgEdit
  }
  // console.log('===msgEdit recipe', msgEditRecipe)

  RecipeModel.findById(id)
    .then((recipe) => {
   
      // show only edit button when logged in
      let userLoggedIn
      let creatorLoggedIn

      if (req.session.loggedInUser) {
        userLoggedIn = true
        console.log('A userlogged in: ', userLoggedIn)

      // show only delete button when logged in  
        if (req.session.loggedInUser.username == recipe.creator) {
          creatorLoggedIn = true
          console.log('A userlogged in: ', creatorLoggedIn)
        }
      }

      res.render('public/recipe.hbs', {recipe, msgEditRecipe, userLoggedIn, creatorLoggedIn})
    })
    .catch((err) => {
      next(err)
    })
});


// GET Route for search page
router.get('/search', (req, res, next) => {
  let veganOn = req.query.isVegan
  let mealTypeArr ={}
  if(veganOn === 'veganOn'){
    mealTypeArr = {mealType:'vegan'}
  }

  // let mealTypeArr = {} //default filter
  // let veganOn = req.query.isVegan
  // // if(veganOn === undefined){
  // //   mealTypeArr = {}
  // // }
  // console.log('veganOn: ', veganOn)
  // if (veganOn == "veganOn") {
  //   mealTypeArr = {mealType:"vegan"}
  //   console.log('vegan true')
  // }
  // else if (veganOn == "veganOff") {
  //   mealTypeArr = {mealType:"meat"}
  //   console.log('vegan false')
  // }
  // console.log('mealtype:', mealTypeArr)

  let timeArr = {} //default filter
  let maxTime = req.query.maxTime
  //console.log('maxTime: ', maxTime)
  if (maxTime == "shortTime") {
    timeArr = {time: {$lt: 15}}
    //console.log('time short')
  }
  // else if (maxTime == "notShortTime") {
  //   timeArr = {time: {$gte: 15}}
  //   console.log('time all')
  // }
  // console.log('time:', timeArr)

  let priceArr = {} //default filter
  let maxPrice = req.query.maxPrice
  //console.log('maxPrice: ', maxPrice)
  if (maxPrice == "cheap") {
    priceArr = {priceCategory:'cheap'}
    //console.log('price low')
  }
  // else if (maxPrice == "notLowPrice") {
  //   priceArr = {priceCategory:'normal'}
  //   console.log('price all')
  // }
  // // else if(maxPrice == 'highPrice'){
  // //   timeArr = {priceCategory: 'expensive'}
  // //   console.log('price expensive')
  // // }
  // console.log('price:', priceArr)

  // let query = `isVegan=${veganOn}&maxTime=${maxTime}&maxPrice=${maxPrice}`
  //let query = `isVegan=${veganOn}&maxTime=${timeFilter}&maxPrice=${priceFilter}`
  RecipeModel.find({$and: [mealTypeArr, timeArr, priceArr] })
  .then((recipes) => {
    // console.log(recipes)
    res.render('public/search.hbs', {recipes})
    //console.log(recipes, mealTypeArr, query)
  })
  .catch((err) => {                                                                                                                                                                                                
    next(err)
  })
  // const searchTerm = req.query.searchInput
  // request('https://api.spoonacular.com/recipes/complexSearch?query=pasta&apiKey=62f15d05010744ed8127ef36815ed931', function(error, response, body) {
  //     res.render('public/search.hbs', {recipes})  
  // })
  // res.render('public/search.hbs')
      
});


router.post('/selector', (req, res) => {
  
  let {isVegan: veganOn, maxTime, maxPrice} = req.body

  let mealTypeArr = {} //default filter

  // if(veganOn === undefined){
  //   mealTypeArr = {}
  // }
  console.log('veganOn: ', veganOn)
  if (veganOn == "veganOn") {
    mealTypeArr = {mealType:"vegan"}
    console.log('vegan true')
  }
  else if (veganOn == "veganOff") {
    mealTypeArr = {}
    console.log('vegan false')
  }
  // console.log('mealtype:', mealTypeArr)


  let timeArr = {} //default filter

  console.log('maxTime: ', maxTime)
  if (maxTime == "shortTime") {
    timeArr = {time: {$lt: 15}}
    console.log('time short')
  }
  else if (maxTime == "notShortTime") {
    timeArr = {time: {$gte: 15}}
    console.log('time all')
  }
  console.log('time:', timeArr)

  let priceArr = {} //default filter
  
  console.log('maxPrice: ', maxPrice)
  if (maxPrice == "lowPrice") {
    priceArr = {priceCategory:'cheap'}
    console.log('price low')
  }
  else if (maxPrice == "notLowPrßice") {
    priceArr = {priceCategory:'normal'}
    console.log('price all')
  }
  let queryObj = {
    isVegan: veganOn,
    maxTime,
    maxPrice
}
  let query = `isVegan=${veganOn}&maxTime=${maxTime}&maxPrice=${maxPrice}`
  RecipeModel.find({$and: [mealTypeArr, timeArr, priceArr] })
  .then((recipes) => {
    // console.log(recipes)
    console.log(recipes.length)
    let data = recipes
    //res.redirect(`/fakeapi?isVegan=${veganOn}&maxTime=${maxTime}&maxPrice=${maxPrice}`)
    console.log('---------------------')
    console.log(queryObj)
    res.render('public/selector.hbs', {recipes:data, queryObj, length: recipes.length})
    //console.log(recipes, query)
  })
  .catch((err) => {                                                                                                                                                                                                
    next(err)
  })
})


router.get('/selector', (req, res) => {
  let msgRecipeDel = req.query.passMsgDeleted

  RecipeModel.find()
  .then((recipes) => {
      if (Object.keys(req.query).length!=0) {
        res.render('public/selector.hbs', {recipes, msgRecipeDel})
        // console.log('check1')
      }
      else {
        res.render('public/selector.hbs', {recipes})
        // console.log('check2')
      }   

    
  })
  .catch((err) => {                                                                                                                                                                                                
    next(err)
  })
})

router.post('/selector/random', (req, res, next) => {
  console.log('hallooooooo')
  RecipeModel.find()
    .then((allRecipe) => {
      let randomId = Math.floor(Math.random() * Math.floor(allRecipe.length))
      res.redirect(`/recipe/${allRecipe[randomId]._id}`)//console.log(allRecipe[0]._id)
    })
    .catch(() => {

    })

})


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
