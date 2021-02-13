const mongoose = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const RecipeSchema = new mongoose.Schema({
  title: String,
  image: String,
  id: Number
});



const RecipeModel = mongoose.model("recipe", RecipeSchema);

module.exports = RecipeModel;
