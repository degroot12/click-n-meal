// seeding the ingredients from World Open Foodfacts: https://wiki.openfoodfacts.org/API

require('../db/index')

const IngredientsModel = require('../models/Ingredients.model')
const mongoose = require('mongoose')
const axios = require('axios')

axios.get('https://world.openfoodfacts.org/ingredients.json')
  .then((response) => {
    IngredientsModel.insertMany(response.data.tags)
      .then(() => {
        console.log('data ingredients inserted')
        mongoose.connection.close()
      })
      .catch((err) => {
        console.log('Error while retrieving data: ', err)    
        mongoose.connection.close()   
      })
  })
  .catch((err) => {
    console.log('Error while retrieving data: ', err)
  });

