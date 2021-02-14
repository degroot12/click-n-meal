const mongoose = require('mongoose');

const IngredientsSchema = new mongoose.Schema({
  name: String
}); 
 

const IngredientsModel = mongoose.model('ingredient', IngredientsSchema);

module.exports = IngredientsModel;