const mongoose = require("mongoose");
const IngredientsModel = require('./Ingredients.model.js')
// TODO: Please make sure you edit the user model to whatever makes sense in this case
const RecipeSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  instructions: String,
  time: Number,
  priceCategory: {
    type: String,
    enum: ['cheap', 'normal', 'expensive']
  },
  ingredients: String
  
});

const RecipeModel = mongoose.model("recipe", RecipeSchema);

module.exports = RecipeModel;
