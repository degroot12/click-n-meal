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
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      enum: ['piece', 'g', 'spoon', 'tablespoon', 'l', 'pinch', 'ml'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5]
  },
  source: String,
  creator: String,
  weekday: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  mealType: {
    type: String,
    enum: ['meat', 'vegetarian', 'vegan']
  },
  allIngr: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ingredient'

  }
});

const RecipeModel = mongoose.model("recipe", RecipeSchema);

module.exports = RecipeModel;
