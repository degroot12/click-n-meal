//connect to your db

require('../db/index.js')

// get recipe Model
const RecipeModel = require('../models/Recipe.model.js')

// Get data from external server

const axios = require('axios')
const mongoose = require('mongoose')

axios.get('https://api.spoonacular.com/recipes/complexSearch?apiKey=62f15d05010744ed8127ef36815ed931')
  .then((response) => {
    RecipeModel.insertMany(response.data.results)
    .then(() => {
      console.log(response.data.results)
      mongoose.connection.close()
    })
    .catch(() => {
      console.log('something went wrong')
      mongoose.connection.close()
    })
    
  })
  .catch(() => {
    console.log('err while fetching')
  })